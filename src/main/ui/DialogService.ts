/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, ViewContainerRef, ComponentFactoryResolver, Renderer } from "@angular/core";
import { Dialog } from "./Dialog";
import { ConfirmDialog } from "./ConfirmDialog";

/**
 * The dialog service used to spawn new dialogs.
 */
@Injectable()
export class DialogService {
    private componentFactoryResolver: ComponentFactoryResolver;
    private viewContainer: ViewContainerRef;
    private renderer: Renderer;

    public constructor(componentFactoryResolver: ComponentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }

    /**
     * Registers a dialog outlet on the service so the service knows where to place new dialogs. Is called
     * internally by [DialogOutletComponent]. All you have to do is use the dialog outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer) {
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
        const dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
        const dialogComponentRef = viewContainer.createComponent(dialogComponentFactory);
        const dialog = dialogComponentRef.instance;
        const element = dialogComponentRef.location.nativeElement;
        if (init) {
            init(dialog);
        }
        setTimeout(() => this.renderer.setElementClass(element, "open", true), 0);
        return new Promise<V | null>(resolve => {
            dialog.onClosed.subscribe((value: V | null) => {
                this.renderer.setElementClass(element, "open", false);
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
