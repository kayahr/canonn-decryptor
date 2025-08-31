/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, Renderer2, ViewContainerRef } from "@angular/core";

import { IllegalStateError } from "../utils/error.js";
import { ToastComponent } from "./ToastComponent.js";

/**
 * The toast service used to spawn new toasts.
 */
@Injectable({ providedIn: "root" })
export class ToastService {
    private viewContainer: ViewContainerRef | null = null;
    private renderer: Renderer2 | null = null;

    /**
     * Registers a toast outlet on the service so the service knows where to place new toasts. Is called
     * internally by [[ToastOutletComponent]]. All you have to do is use the toast outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer2): void {
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
        const renderer = this.renderer;
        if (viewContainer == null || renderer == null) {
            throw new IllegalStateError("Toast service outlet not registered");
        }
        const toastComponentRef = viewContainer.createComponent(ToastComponent);
        const toast = toastComponentRef.instance;
        toast.text = text;
        const element = toastComponentRef.location.nativeElement as HTMLElement;
        setTimeout(() => renderer.addClass(element, "open"), 0);
        setTimeout(() => {
            renderer.removeClass(element, "open");
            setTimeout(() => toastComponentRef.destroy(), 1000);
        }, duration > 0 ? duration : text.length);
    }
}
