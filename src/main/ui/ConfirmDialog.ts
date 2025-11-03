/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, HostListener } from "@angular/core";

import template from "../../../assets/ui/confirm-dialog.html";
import { ButtonDirective } from "./ButtonDirective.ts";
import { Dialog } from "./Dialog.ts";
import { DialogComponent } from "./DialogComponent.ts";

/**
 * Common dialog to display a confirmation message and let the user confirm or cancel it.
 */
@Component({
    imports: [
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class ConfirmDialog extends Dialog<string> {
    public title = "Confirm";
    public body = "";

    /**
     * Confirms the dialog when pressing Enter.
     */
    @HostListener("window:keydown", [ "$event" ])
    public handleEnter(event: KeyboardEvent): void {
        if (!event.defaultPrevented && event.key === "Enter") {
            this.close("ok");
        }
    }
}
