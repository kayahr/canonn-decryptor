/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, Renderer2, ViewContainerRef } from "@angular/core";

import { IllegalStateError } from "../utils/error.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { Dialog } from "./Dialog.js";

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
     * @param dialogComponent  The dialog component type to create and open.
     * @param init             Optional initializer function which is called with the created dialog as argument.
     *                         You can place dialog initialization code in here.
     * @return The dialog result.
     */
    public openDialog<V, T extends Dialog<V>>(
            dialogComponent: { new (...args: any[]): T & Dialog<V> },
            init?: (dialog: T) => void): Promise<V | null> {
        const viewContainer = this.viewContainer;
        const renderer = this.renderer;
        if (viewContainer == null || renderer == null) {
            throw new IllegalStateError("Dialog service outlet to registered");
        }
        const dialogComponentRef = viewContainer.createComponent(dialogComponent);
        const dialog = dialogComponentRef.instance;
        const element = dialogComponentRef.location.nativeElement as HTMLElement;
        init?.(dialog);
        setTimeout(() => renderer.addClass(element, "open"), 0);
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
     * @param body   The confirm dialog body text.
     * @param title  Optional confirm dialog title. Defaults to "Confirm"
     * @return True if dialog is confirmed, false if canceled or closed.
     */
    public async confirm(body: string, title = "Confirm"): Promise<boolean> {
        return await this.openDialog(ConfirmDialog, component => {
            component.body = body;
            component.title = title;
        }) === "ok";
    }
}
