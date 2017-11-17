/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { Dialog } from "./ui/Dialog";

/**
 * Displays the changelog in a dialog.
 */
@Component({
    templateUrl: "assets/changelog-dialog.html"
})
export class ChangelogDialog extends Dialog<string> {}
