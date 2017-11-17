/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, OnInit } from "@angular/core";
import { ChangelogDialog } from "./ChangelogDialog";
import { DialogService } from "./ui/DialogService";

const appVersion = "1.0.0";

const appVersionKey = "canonn-decryptor.appVersion";

@Component({
    selector: "body",
    templateUrl: "assets/app.html"
})
export class AppComponent implements OnInit {
    private dialogService: DialogService;

    public constructor(dialogService: DialogService) {
        this.dialogService = dialogService;
    }

    public ngOnInit() {
        // Automatically open changelog dialog if last used version it not the current version
        const oldAppVersion = localStorage.getItem(appVersionKey);
        if (oldAppVersion && oldAppVersion !== appVersion) {
            this.openChangelog();
        }
        localStorage.setItem(appVersionKey, appVersion);
    }

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
        this.dialogService.openDialog(ChangelogDialog);
    }
}
