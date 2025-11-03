/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, type Renderer2, type ViewContainerRef } from "@angular/core";

import { IllegalStateError } from "../utils/error.ts";
import { ToastComponent } from "./ToastComponent.ts";

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
     * @param text    - The text to display in a toast.
     * @param options - Optional toast options: duration and type.
     *                  - duration: Display time in ms. Defaults to word-count-based duration.
     *                  - type: "info" (default) or "warning".
     */
    public showToast(text: string, options?: { duration?: number, type?: "info" | "warning" }): void {
        const viewContainer = this.viewContainer;
        const renderer = this.renderer;
        if (viewContainer == null || renderer == null) {
            throw new IllegalStateError("Toast service outlet not registered");
        }
        const toastComponentRef = viewContainer.createComponent(ToastComponent);
        const toast = toastComponentRef.instance;
        toast.text = text;
        const element = toastComponentRef.location.nativeElement as HTMLElement;
        const type = options?.type ?? "info";
        renderer.addClass(element, type);
        const duration = options?.duration ?? Math.max(1000, text.split(/\s+/).length * 350);
        setTimeout(() => renderer.addClass(element, "open"), 0);
        setTimeout(() => {
            renderer.removeClass(element, "open");
            setTimeout(() => toastComponentRef.destroy(), 1000);
        }, duration > 0 ? duration : text.length);
    }
}
