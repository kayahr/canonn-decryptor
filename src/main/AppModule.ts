/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DecryptorModule } from "./decryptor/DecryptorModule";
import { AppComponent } from "./AppComponent";
import { UIModule } from "./ui/UIModule";
import { ChangelogDialog } from "./ChangelogDialog";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        UIModule,
        RouterModule,
        DecryptorModule
    ],
    declarations: [
        AppComponent,
        ChangelogDialog
    ],
    entryComponents: [
        ChangelogDialog
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
