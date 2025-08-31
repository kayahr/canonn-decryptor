/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import template from "../../assets/app.html?raw";
import packageJSON from "../../package.json" with { type: "json" };
import { ChangelogDialog } from "./ChangelogDialog.js";
import { ButtonDirective } from "./ui/ButtonDirective.js";
import { DialogOutletComponent } from "./ui/DialogOutletComponent.js";
import { DialogService } from "./ui/DialogService.js";
import { ToastOutletComponent } from "./ui/ToastOutletComponent.js";

const appVersion = packageJSON.version;

@Component({
    selector: "body",
    imports: [
        CommonModule,
        RouterModule,
        DialogOutletComponent,
        ToastOutletComponent,
        ButtonDirective
    ],
    template
})
export class AppComponent {
    private readonly dialogService = inject(DialogService);

    /**
     * Returns the application version.
     *
     * @return The application version.
     */
    public get appVersion(): string {
        return appVersion;
    }

    /**
     * Opens the changelog dialog.
     */
    public openChangelog(): void {
        void this.dialogService.openDialog(ChangelogDialog);
    }
}
