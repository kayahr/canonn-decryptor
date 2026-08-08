/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, signal } from "@angular/core";

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
    public readonly title = signal("Confirm");
    public readonly body = signal("");

    /**
     * Confirms the dialog when pressing Enter.
     */
    public override handleKeydown(event: KeyboardEvent): void {
        if (!event.defaultPrevented && event.key === "Enter") {
            event.preventDefault();
            this.close("ok");
        } else {
            super.handleKeydown(event);
        }
    }
}
