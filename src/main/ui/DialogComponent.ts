/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";

import template from "../../../assets/ui/dialog.html";

/**
 * The component used to display modal dialogs.
 */
@Component({
    selector: "div.dialog",
    changeDetection: ChangeDetectionStrategy.Eager,
    template
})
export class DialogComponent {}
