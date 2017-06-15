/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, ViewContainerRef, ComponentFactoryResolver, Renderer } from "@angular/core";
import { ToastComponent } from "./ToastComponent";

/**
 * The toast service used to spawn new toasts.
 */
@Injectable()
export class ToastService {
    private componentFactoryResolver: ComponentFactoryResolver;
    private viewContainer: ViewContainerRef;

    private renderer: Renderer;

    public constructor(componentFactoryResolver: ComponentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }

    /**
     * Registers a toast outlet on the service so the service knows where to place new toasts. Is called
     * internally by [[ToastOutletComponent]]. All you have to do is use the toast outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer) {
        this.viewContainer = viewContainer;
        this.renderer = renderer;
    }

    /**
     * Shows a new toast with the given text.
     *
     * @param text  The text to display in a toast.
     * @param duration  Optional toast display duration in milliseconds. If not specified then the duration is
     *                  automatically calculated by counting the number of words.
     */
    public showToast(text: string, duration: number = Math.max(1000, text.split(/\s+/).length * 350)): void {
        const viewContainer = this.viewContainer;
        const toastComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
        const toastComponentRef = viewContainer.createComponent(toastComponentFactory);
        const toast = toastComponentRef.instance;
        toast.text = text;
        const element = toastComponentRef.location.nativeElement;
        setTimeout(() => this.renderer.setElementClass(element, "open", true), 0);
        setTimeout(() => {
            this.renderer.setElementClass(element, "open", false);
            setTimeout(() => toastComponentRef.destroy(), 1000);
        }, duration ? duration : text.length );
    }
}
