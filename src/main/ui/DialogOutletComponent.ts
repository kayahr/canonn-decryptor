/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, inject, Renderer2, ViewContainerRef } from "@angular/core";

import { DialogService } from "./DialogService.js";

/**
 * The dialog outlet component used in the main HTML file to define the area in which dialog components are
 * created on demand.
 */
@Component({
    selector: "dialog-outlet",
    template: " "
})
export class DialogOutletComponent {
    public constructor() {
        const dialogService = inject(DialogService);
        const viewContainer = inject(ViewContainerRef);
        const renderer = inject(Renderer2);
        dialogService.registerOutlet(viewContainer, renderer);
    }
}
