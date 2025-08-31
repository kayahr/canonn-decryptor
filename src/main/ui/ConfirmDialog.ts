/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import template from "../../../assets/ui/confirm-dialog.html?raw";
import { ButtonDirective } from "./ButtonDirective.js";
import { Dialog } from "./Dialog.js";
import { DialogComponent } from "./DialogComponent.js";

/**
 * Common dialog to display a confirmation message and let the user confirm or cancel it.
 */
@Component({
    imports: [
        CommonModule,
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class ConfirmDialog extends Dialog<string> {
    public title = "Confirm";
    public body = "";
}
