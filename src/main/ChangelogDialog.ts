/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";

import template from "../../assets/changelog-dialog.html";
import { ButtonDirective } from "./ui/ButtonDirective.ts";
import { Dialog } from "./ui/Dialog.ts";
import { DialogComponent } from "./ui/DialogComponent.ts";

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
