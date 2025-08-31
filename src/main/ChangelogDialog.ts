/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";

import template from "../../assets/changelog-dialog.html?raw";
import { ButtonDirective } from "./ui/ButtonDirective.js";
import { Dialog } from "./ui/Dialog.js";
import { DialogComponent } from "./ui/DialogComponent.js";

/**
 * Displays the changelog in a dialog.
 */
@Component({
    imports: [
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class ChangelogDialog extends Dialog<string> {}
