/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, Renderer2, ViewContainerRef } from "@angular/core";

import { IllegalStateError } from "../utils/error.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { Dialog } from "./Dialog.js";

/**
 * Options for opening a dialog.
 */
export interface DialogOptions<T> {
    /** Optional initializer function which is called with the created dialog as argument. You can place dialog initialization code in here. */
    init?: (dialog: T) => void;

    /** HTML element owning the dialog. When specified then the dialog is opened near this element. Otherwise it centered on screen. */
    owner?: HTMLElement;
}

/**
 * The dialog service used to spawn new dialogs.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
    private viewContainer: ViewContainerRef | null = null;
    private renderer: Renderer2 | null = null;

    /**
     * Registers a dialog outlet on the service so the service knows where to place new dialogs. Is called
     * internally by [DialogOutletComponent]. All you have to do is use the dialog outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer2): void {
        this.viewContainer = viewContainer;
        this.renderer = renderer;
    }

    /**
     * Creates and opens a dialog of the specified type and asynchronously returns the dialog result.
     *
     * @param dialogComponent - The dialog component type to create and open.
     * @param options         - Optional dialog options.
     * @returns The dialog result.
     */
    public openDialog<V, T extends Dialog<V>>(dialogComponent: { new (...args: any[]): T & Dialog<V> }, { init, owner }: DialogOptions<T> = {}):
            Promise<V | null> {
        const viewContainer = this.viewContainer;
        const renderer = this.renderer;
        if (viewContainer == null || renderer == null) {
            throw new IllegalStateError("Dialog service outlet not registered");
        }
        const dialogComponentRef = viewContainer.createComponent(dialogComponent);
        const dialog = dialogComponentRef.instance;
        const element = dialogComponentRef.location.nativeElement as HTMLElement;
        init?.(dialog);
        setTimeout(() => {
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
            renderer.addClass(element, "open");
        }, 0);
        return new Promise<V | null>(resolve => {
            dialog.onClosed.subscribe((value: V | null) => {
                renderer.removeClass(element, "open");
                setTimeout(() => dialogComponentRef.destroy(), 250);
                resolve(value);
            });
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
                component.body = body;
                component.title = title;
                init?.(component);
            },
            ...options
        }) === "ok";
    }
}
