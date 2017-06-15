/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { Dialog } from "../ui/Dialog";
import { DialogService } from "../ui/DialogService";
import { ProjectService } from "./ProjectService";
import { ProjectStatic, Project } from "./Project";
import { ToastService } from "../ui/ToastService";

/**
 * Dialog which displays the list of previously saved projects and let the user load or delete a project.
 */
@Component({
    templateUrl: "assets/project/load-project-dialog.html"
})
export class LoadProjectDialog extends Dialog<string> {
    public projectType: ProjectStatic<Project>;
    private readonly dialogService: DialogService;
    private readonly toastService: ToastService;
    private readonly projectService: ProjectService;

    public constructor(dialogService: DialogService, toastService: ToastService, projectService: ProjectService) {
        super();
        this.dialogService = dialogService;
        this.toastService = toastService;
        this.projectService = projectService;
    }

    /**
     * Returns a list of all project names.
     *
     * @return All project names.
     */
    public get projectNames(): string[] {
        return this.projectService.loadProjects(this.projectType).map(project => project.getName());
    }

    /**
     * Deletes the project with the given name. A confirmation dialog must be answered by the user first.
     *
     * @param projectName  The name of the project to delete.
     */
    public async delete(projectName: string): Promise<void> {
        if (await this.dialogService.confirm(`Area you sure you want to delete '${projectName}'?`)) {
            this.projectService.deleteProject(this.projectType, projectName);
            this.toastService.showToast(`Project '${projectName}' has been deleted`);
        }
    }
}
