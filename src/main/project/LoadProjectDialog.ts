/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import template from "../../../assets/project/load-project-dialog.html?raw";
import { ButtonDirective } from "../ui/ButtonDirective.js";
import { Dialog } from "../ui/Dialog.js";
import { DialogComponent } from "../ui/DialogComponent.js";
import { DialogService } from "../ui/DialogService.js";
import { ToastService } from "../ui/ToastService.js";
import { IllegalStateError } from "../utils/error.js";
import { Project, type ProjectStatic } from "./Project.js";
import { ProjectService } from "./ProjectService.js";

/**
 * Dialog which displays the list of previously saved projects and let the user load or delete a project.
 */
@Component({
    imports: [
        CommonModule,
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class LoadProjectDialog extends Dialog<string> {
    public projectType: ProjectStatic<Project> | null = null;
    private readonly dialogService = inject(DialogService);
    private readonly toastService = inject(ToastService);
    private readonly projectService = inject(ProjectService);

    /**
     * Returns a list of all project names.
     *
     * @return All project names.
     */
    public get projectNames(): string[] {
        if (this.projectType == null) {
            throw new IllegalStateError("Project type not set");
        }
        return this.projectService.loadProjects(this.projectType).map(project => project.getName());
    }

    /**
     * Deletes the project with the given name. A confirmation dialog must be answered by the user first.
     *
     * @param projectName  The name of the project to delete.
     */
    public async delete(projectName: string): Promise<void> {
        if (this.projectType == null) {
            throw new IllegalStateError("Project type not set");
        }
        if (await this.dialogService.confirm(`Area you sure you want to delete '${projectName}'?`)) {
            this.projectService.deleteProject(this.projectType, projectName);
            this.toastService.showToast(`Project '${projectName}' has been deleted`);
        }
    }
}
