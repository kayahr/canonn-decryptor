/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, ViewContainerRef, Renderer } from "@angular/core";
import { DialogService } from "./DialogService";

/**
 * The dialog outlet component used in the main HTML file to define the area in which dialog components are
 * created on demand.
 */
@Component({
    selector: "dialog-outlet",
    template: " "
})
export class DialogOutletComponent {
    public constructor(dialogService: DialogService, viewContainer: ViewContainerRef, renderer: Renderer) {
        dialogService.registerOutlet(viewContainer, renderer);
    }
}
