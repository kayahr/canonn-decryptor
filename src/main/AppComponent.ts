/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import template from "../../assets/app.html";
import packageJSON from "../../package.json" with { type: "json" };
import { ChangelogDialog } from "./ChangelogDialog.ts";
import { ButtonDirective } from "./ui/ButtonDirective.ts";
import { DialogOutletComponent } from "./ui/DialogOutletComponent.ts";
import { DialogService } from "./ui/DialogService.ts";
import { ToastOutletComponent } from "./ui/ToastOutletComponent.ts";

const appVersion = packageJSON.version;

@Component({
    selector: "body",
    imports: [
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
     * @returns The application version.
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
