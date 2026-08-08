/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable, type Renderer2, type ViewContainerRef } from "@angular/core";

import { IllegalStateError } from "../utils/error.ts";
import { ToastComponent } from "./ToastComponent.ts";

interface ToastOutlet {
    readonly renderer: Renderer2;
    readonly viewContainer: ViewContainerRef;
}

interface OpenToast {
    destroy(): void;
}

/**
 * The toast service used to spawn new toasts.
 */
@Injectable({ providedIn: "root" })
export class ToastService {
    private outlet: ToastOutlet | null = null;
    private readonly toasts = new Set<OpenToast>();

    /**
     * Registers a toast outlet on the service so the service knows where to place new toasts. Is called
     * internally by [[ToastOutletComponent]]. All you have to do is use the toast outlet component somewhere in your
     * main HTML file.
     */
    public registerOutlet(viewContainer: ViewContainerRef, renderer: Renderer2): () => void {
        this.unregisterOutlet();
        const outlet: ToastOutlet = { viewContainer, renderer };
        this.outlet = outlet;
        return () => {
            if (this.outlet === outlet) {
                this.unregisterOutlet();
            }
        };
    }

    /** Unregisters the current outlet and immediately disposes all toasts owned by it. */
    private unregisterOutlet(): void {
        if (this.outlet != null) {
            this.outlet = null;
            for (const toast of this.toasts) {
                toast.destroy();
            }
        }
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
        const outlet = this.outlet;
        if (outlet == null) {
            throw new IllegalStateError("Toast service outlet not registered");
        }
        const { viewContainer, renderer } = outlet;
        const toastComponentRef = viewContainer.createComponent(ToastComponent);
        const toast = toastComponentRef.instance;
        toast.text.set(text);
        const element = toastComponentRef.location.nativeElement as HTMLElement;
        const type = options?.type ?? "info";
        renderer.addClass(element, type);
        const duration = options?.duration ?? Math.max(1000, text.split(/\s+/).length * 350);
        let openTimer: ReturnType<typeof setTimeout> | null = null;
        let closeTimer: ReturnType<typeof setTimeout> | null = null;
        let destroyTimer: ReturnType<typeof setTimeout> | null = null;
        let destroyed = false;
        const clearTimers = (): void => {
            if (openTimer != null) {
                clearTimeout(openTimer);
                openTimer = null;
            }
            if (closeTimer != null) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
            if (destroyTimer != null) {
                clearTimeout(destroyTimer);
                destroyTimer = null;
            }
        };
        const handleExternalDestroy = (): void => {
            if (!destroyed) {
                destroyed = true;
                clearTimers();
                this.toasts.delete(entry);
            }
        };
        const destroy = (): void => {
            if (!destroyed) {
                destroyed = true;
                clearTimers();
                this.toasts.delete(entry);
                toastComponentRef.destroy();
            }
        };
        const entry: OpenToast = { destroy };
        this.toasts.add(entry);
        toastComponentRef.onDestroy(handleExternalDestroy);
        openTimer = setTimeout(() => {
            openTimer = null;
            if (!destroyed) {
                renderer.addClass(element, "open");
            }
        }, 0);
        closeTimer = setTimeout(() => {
            closeTimer = null;
            if (destroyed) {
                return;
            }
            renderer.removeClass(element, "open");
            destroyTimer = setTimeout(destroy, 1000);
        }, duration > 0 ? duration : text.length);
    }
}
