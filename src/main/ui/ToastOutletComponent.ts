/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, ViewContainerRef, Renderer } from "@angular/core";
import { ToastService } from "./ToastService";

/**
 * The toast outlet component used in the main HTML file to define the area in which toast components are
 * created on demand.
 */
@Component({
    selector: "toast-outlet",
    template: " "
})
export class ToastOutletComponent {
    public constructor(toastService: ToastService, viewContainer: ViewContainerRef, renderer: Renderer) {
        toastService.registerOutlet(viewContainer, renderer);
    }
}
