import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import template from "../../../assets/ui/dialog.html?raw";

/**
 * The component used to display modal dialogs.
 */
@Component({
    selector: "div.dialog",
    imports: [
        CommonModule
    ],
    template
})
export class DialogComponent {}
