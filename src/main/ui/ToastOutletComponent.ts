/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, inject, Renderer2, ViewContainerRef } from "@angular/core";

import { ToastService } from "./ToastService.js";

/**
 * The toast outlet component used in the main HTML file to define the area in which toast components are
 * created on demand.
 */
@Component({
    selector: "toast-outlet",
    template: " "
})
export class ToastOutletComponent {
    public constructor() {
        const toastService = inject(ToastService);
        const viewContainer = inject(ViewContainerRef);
        const renderer = inject(Renderer2);
        toastService.registerOutlet(viewContainer, renderer);
    }
}
