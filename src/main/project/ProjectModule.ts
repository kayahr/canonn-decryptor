/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoadProjectDialog } from "./LoadProjectDialog";
import { ProjectService } from "./ProjectService";
import { UIModule } from "../ui/UIModule";

@NgModule({
    providers: [
        ProjectService
    ],
    imports: [
        CommonModule,
        FormsModule,
        UIModule
    ],
    declarations: [
        LoadProjectDialog
    ],
    entryComponents: [
        LoadProjectDialog
    ]
})
export class ProjectModule {}
