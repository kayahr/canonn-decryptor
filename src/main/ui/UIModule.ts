/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DialogService } from "./DialogService";
import { DialogOutletComponent } from "./DialogOutletComponent";
import { DialogComponent } from "./DialogComponent";
import { ConfirmDialog } from "./ConfirmDialog";
import { ToastComponent } from "./ToastComponent";
import { ToastOutletComponent } from "./ToastOutletComponent";
import { ToastService } from "./ToastService";
import { LabelDirective } from "./LabelDirective";
import { FocusDirective } from "./FocusDirective";
import { CustomCheckboxDirective } from "./CustomCheckboxDirective";
import { NoUpdateOnEditDirective } from "./NoUpdateOnEditDirective";

@NgModule({
    imports: [
        BrowserModule
    ],
    providers: [
        DialogService,
        ToastService
    ],
    declarations: [
        NoUpdateOnEditDirective,
        CustomCheckboxDirective,
        FocusDirective,
        LabelDirective,
        DialogOutletComponent,
        DialogComponent,
        ToastOutletComponent,
        ToastComponent,
        ConfirmDialog
    ],
    entryComponents: [
        ConfirmDialog,
        ToastComponent
    ],
    exports: [
        NoUpdateOnEditDirective,
        CustomCheckboxDirective,
        FocusDirective,
        LabelDirective,
        DialogOutletComponent,
        DialogComponent,
        ToastOutletComponent,
        ToastComponent
    ]
})
export class UIModule {}
