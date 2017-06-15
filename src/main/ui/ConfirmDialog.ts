/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { Dialog } from "./Dialog";

/**
 * Common dialog to display a confirmation message and let the user confirm or cancel it.
 */
@Component({
    templateUrl: "assets/ui/confirm-dialog.html"
})
export class ConfirmDialog extends Dialog<string> {
    public title = "Confirm";
    public body = "";
}
