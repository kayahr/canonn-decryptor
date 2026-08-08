/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type ComponentRef, Injectable, type Renderer2, type ViewContainerRef } from "@angular/core";
import type { Subscription } from "rxjs";

import { IllegalStateError } from "../utils/error.ts";
import { ConfirmDialog } from "./ConfirmDialog.ts";
import type { Dialog } from "./Dialog.ts";

/**
 * Options for opening a dialog.
 */
export interface DialogOptions<T> {
    /** Optional initializer function which is called with the created dialog as argument. You can place dialog initialization code in here. */
    init?: (dialog: T) => void;

    /** HTML element owning the dialog. When specified then the dialog is opened near this element. Otherwise it centered on screen. */
    owner?: HTMLElement;
}

interface DialogOutlet {
    readonly removeKeydownListener: () => void;
    readonly renderer: Renderer2;
    readonly viewContainer: ViewContainerRef;
}

interface OpenDialog {
    cancel(): void;
    handleKeydown(event: KeyboardEvent): void;
}

/**
 * The dialog service used to spawn new dialogs.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
    private outlet: DialogOutlet | null = null;
    private readonly activeDialogs: OpenDialog[] = [];
    private readonly dialogs = new Set<OpenDialog>();

    /**
     * Registers a dialog outlet on the service so the service knows where to place new dialogs. Is called
     * internally by [DialogOutletComponent]. All you have to do is use the dialog outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer2): () => void {
        this.unregisterOutlet();
        const outlet: DialogOutlet = {
            viewContainer,
            renderer,
            removeKeydownListener: renderer.listen("window", "keydown", (event: KeyboardEvent) => {
                const dialog = this.activeDialogs.at(-1);
                dialog?.handleKeydown(event);
            })
        };
        this.outlet = outlet;
        return () => {
            if (this.outlet === outlet) {
                this.unregisterOutlet();
            }
        };
    }

    /** Unregisters the current outlet and immediately disposes all dialogs owned by it. */
    private unregisterOutlet(): void {
        const outlet = this.outlet;
        if (outlet != null) {
            this.outlet = null;
            outlet.removeKeydownListener();
            for (const dialog of this.dialogs) {
                dialog.cancel();
            }
        }
    }

    /**
     * Creates and opens a dialog of the specified type and asynchronously returns the dialog result.
     *
     * @param dialogComponent - The dialog component type to create and open.
     * @param options         - Optional dialog options.
     * @returns The dialog result.
     */
    public openDialog<V, T extends Dialog<V>>(dialogComponent: new (...args: any[]) => T & Dialog<V>, { init, owner }: DialogOptions<T> = {}):
            Promise<V | null> {
        const outlet = this.outlet;
        if (outlet == null) {
            throw new IllegalStateError("Dialog service outlet not registered");
        }
        const { viewContainer, renderer } = outlet;
        return new Promise<V | null>((resolve, reject) => {
            let dialogComponentRef: ComponentRef<T & Dialog<V>>;
            try {
                dialogComponentRef = viewContainer.createComponent(dialogComponent);
            } catch (error) {
                reject(error);
                return;
            }

            const dialog = dialogComponentRef.instance;
            const element = dialogComponentRef.location.nativeElement as HTMLElement;
            let subscription: Subscription | null = null;
            let openTimer: ReturnType<typeof setTimeout> | null = null;
            let closeTimer: ReturnType<typeof setTimeout> | null = null;
            let initialized = false;
            let hasPendingResult = false;
            let pendingResult: V | null = null;
            let opened = false;
            let closing = false;
            let destroyed = false;
            let settled = false;

            const removeFromActiveDialogs = (): void => {
                const index = this.activeDialogs.indexOf(entry);
                if (index !== -1) {
                    this.activeDialogs.splice(index, 1);
                }
            };
            const clearTimers = (): void => {
                if (openTimer != null) {
                    clearTimeout(openTimer);
                    openTimer = null;
                }
                if (closeTimer != null) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
            };
            const settle = (value: V | null): void => {
                if (!settled) {
                    settled = true;
                    resolve(value);
                }
            };
            const detach = (): void => {
                removeFromActiveDialogs();
                this.dialogs.delete(entry);
            };
            const handleExternalDestroy = (): void => {
                if (!destroyed) {
                    destroyed = true;
                    clearTimers();
                    subscription?.unsubscribe();
                    detach();
                    settle(null);
                }
            };
            const destroy = (): void => {
                if (!destroyed) {
                    destroyed = true;
                    clearTimers();
                    subscription?.unsubscribe();
                    detach();
                    dialogComponentRef.destroy();
                }
            };
            const close = (value: V | null): void => {
                if (!closing && !destroyed) {
                    closing = true;
                    if (openTimer != null) {
                        clearTimeout(openTimer);
                        openTimer = null;
                    }
                    removeFromActiveDialogs();
                    renderer.removeClass(element, "open");
                    settle(value);
                    if (opened) {
                        closeTimer = setTimeout(destroy, 250);
                    } else {
                        destroy();
                    }
                }
            };

            const entry: OpenDialog = {
                cancel: () => {
                    settle(null);
                    destroy();
                },
                handleKeydown: event => dialog.handleKeydown(event)
            };
            this.dialogs.add(entry);
            this.activeDialogs.push(entry);
            dialogComponentRef.onDestroy(handleExternalDestroy);
            subscription = dialog.onClosed.subscribe((value: V | null) => {
                if (initialized) {
                    close(value);
                } else {
                    hasPendingResult = true;
                    pendingResult = value;
                }
            });

            try {
                init?.(dialog);
            } catch (error) {
                settled = true;
                reject(error);
                destroy();
                return;
            }
            initialized = true;
            if (hasPendingResult) {
                close(pendingResult);
            } else {
                openTimer = setTimeout(() => {
                    openTimer = null;
                    if (!closing && !destroyed) {
                        if (owner != null) {
                            const frame = element.querySelector(".frame");
                            if (frame != null) {
                                const rect = owner.getBoundingClientRect();
                                const right = window.innerWidth - rect.right;
                                const top = rect.bottom + 10;
                                renderer.setStyle(frame, "right", `${right}px`);
                                renderer.setStyle(frame, "top", `${top}px`);
                                renderer.setStyle(frame, "position", "fixed");
                            }
                        }
                        opened = true;
                        renderer.addClass(element, "open");
                    }
                }, 0);
            }
        });
    }

    /**
     * Creates and opens a confirm dialog with the given body and title and returns the confirmation result.
     *
     * @param body    - The confirm dialog body text.
     * @param options - Optional confirm options with additional optional title property which defaults to "Confirm".
     * @returns True if dialog is confirmed, false if canceled or closed.
     */
    public async confirm(body: string, { title = "Confirm", init, ...options }: DialogOptions<ConfirmDialog> & { title?: string } = {}): Promise<boolean> {
        return await this.openDialog(ConfirmDialog, {
            init: component => {
                component.body.set(body);
                component.title.set(title);
                init?.(component);
            },
            ...options
        }) === "ok";
    }
}
