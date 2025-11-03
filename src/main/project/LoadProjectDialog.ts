/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, inject } from "@angular/core";

import template from "../../../assets/project/load-project-dialog.html";
import { ButtonDirective } from "../ui/ButtonDirective.ts";
import { Dialog } from "../ui/Dialog.ts";
import { DialogComponent } from "../ui/DialogComponent.ts";
import { DialogService } from "../ui/DialogService.ts";
import { ToastService } from "../ui/ToastService.ts";
import { IllegalStateError } from "../utils/error.ts";
import type { Project, ProjectStatic } from "./Project.ts";
import { ProjectService } from "./ProjectService.ts";

/**
 * Dialog which displays the list of previously saved projects and let the user load or delete a project.
 */
@Component({
    imports: [
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
     * @returns All project names.
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
