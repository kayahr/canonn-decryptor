/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ProjectService } from "../project/ProjectService";
import { ProjectState } from "./ProjectState";
import { Project, ProjectStatic } from "./Project";
import { DialogService } from "../ui/DialogService";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { LoadProjectDialog } from "./LoadProjectDialog";
import { ToastService } from "../ui/ToastService";
import { ViewChild, ElementRef } from "@angular/core";
import { StringValue } from "../ui/StringValue";
import { queueFor } from "../utils/function";

/**
 * Abstract base class for a main application component which works on project.
 */
export abstract class ProjectComponent<T extends Project> {
    private readonly type: ProjectStatic<T>;
    protected readonly state: ProjectState<T>;
    protected readonly projectService: ProjectService;
    protected readonly dialogService: DialogService;
    protected readonly toastService: ToastService;
    private readonly router: Router;
    private readonly activatedRoute: ActivatedRoute;
    private queryParamsSubscription: Subscription;
    private stateData = "";

    /**
     * The project name input element which is focused when user tried to save a project without naming the project
     * first.
     */
    @ViewChild("projectNameInput")
    public projectNameInput: ElementRef;

    protected constructor(type: ProjectStatic<T>, state: ProjectState<T>, projectService: ProjectService,
            dialogService: DialogService, toastService: ToastService, router: Router, activatedRoute: ActivatedRoute) {
        this.type = type;
        this.state = state;
        this.projectService = projectService;
        this.dialogService = dialogService;
        this.toastService = toastService;
        this.router = router;
        this.activatedRoute = activatedRoute;
    }

    public ngOnInit() {
        // Listen on project deletions to update the saved state of current project if needed
        this.projectService.onDeleted.connect(this.handleProjectDelete, this);

        // Update router when project state changes
        this.state.onChanged.connect(this.queueUpdateRouter, this);

        // Initialize project state from 'data' query parameter and also update the project state automatically when
        // this parameter changes
        this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(async (params) => {
            const stateData = params["data"];
            if (stateData) {
                if (stateData !== this.stateData) {
                    this.stateData = stateData;
                    this.state.setProject(await this.projectService.import(this.type, stateData));
                }
            } else {
                this.stateData = "";
                this.updateRouter();
            }
        });

        // Update URL right now with current project state
        this.updateRouter();
    }

    public ngOnDestroy() {
        this.queryParamsSubscription.unsubscribe();
        this.state.onChanged.disconnect(this.queueUpdateRouter, this);
        this.projectService.onDeleted.disconnect(this.handleProjectDelete, this);
    }

    private queueUpdateRouter() {
        queueFor(500, this.updateRouter, this);
    }

    private updateRouter() {
        const stateData = this.projectService.export(this.getProject());
        if (stateData !== this.stateData) {
            this.stateData = stateData;
            this.router.navigate([], { queryParams: { data: stateData }, replaceUrl: true });
        }
    }

    /**
     * Called when a project has been deleted. When deleted project is the currently open project then the project
     * saved state is reset.
     */
    private handleProjectDelete(name: string): void {
        const project = this.getProject();
        if (name === project.getName()) {
            project.markAsSaved(false);
        }
    }

    /**
     * Returns the current project.
     *
     * @return The current project.
     */
    protected getProject(): T {
        return this.state.getProject();
    }

    /**
     * Sets the project name.
     *
     * @param value  The project name to set.
     */
    public set projectName(value: StringValue) {
        this.getProject().setName(value.valueOf());
    }

    /**
     * Returns the project name.
     *
     * @return The project name.
     */
    public get projectName(): StringValue {
        return this.getProject().getName();
    }

    /**
     * Checks if project is saved.
     *
     * @return True if project is saved, false if not.
     */
    public get saved(): boolean {
        return this.getProject().isSaved();
    }

    /**
     * Loads a previously saved project.
     */
    public async load(): Promise<void> {
        const name = await this.dialogService.openDialog(LoadProjectDialog, component => {
            component.projectType = this.type;
        });
        if (name) {
            this.state.setProject(this.projectService.load(this.type, name));
        }
    }

    /**
     * Saves the current project. When no project name has been entered yet then the input field is just focused
     * instead and a toast informs the user about the missing project name.
     */
    public async save(): Promise<void> {
        const project = this.state.getProject();
        if (!project.getName()) {
            this.toastService.showToast("Project needs a name to save");
            this.projectNameInput.nativeElement.focus();
        } else {
            await this.projectService.save(this.type, project);
            this.toastService.showToast(`Project '${project.getName()}' has been saved`);
        }
    }
}
