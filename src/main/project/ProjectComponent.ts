/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type EffectRef, type ElementRef, Injector, ViewChild, effect, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import type { Subscription } from "rxjs";

import { ProjectService } from "../project/ProjectService.ts";
import { DialogService } from "../ui/DialogService.ts";
import type { StringValue } from "../ui/StringValue.ts";
import { ToastService } from "../ui/ToastService.ts";
import { LoadProjectDialog } from "./LoadProjectDialog.ts";
import type { Project, ProjectStatic } from "./Project.ts";
import type { ProjectState } from "./ProjectState.ts";

/**
 * Abstract base class for a main application component which works on project.
 */
export abstract class ProjectComponent<T extends Project> {
    protected abstract readonly type: ProjectStatic<T>;
    protected abstract readonly state: ProjectState<T>;
    protected readonly projectService = inject(ProjectService);
    protected readonly dialogService = inject(DialogService);
    protected readonly toastService = inject(ToastService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly injector = inject(Injector);
    private deletedProjectSubscription: Subscription | null = null;
    private queryParamsSubscription: Subscription | null = null;
    private routerEffect: EffectRef | null = null;
    private stateData = "";

    /**
     * The project name input element which is focused when user tried to save a project without naming the project
     * first.
     */
    @ViewChild("projectNameInput")
    public projectNameInput: ElementRef<HTMLInputElement> | null = null;

    public ngOnInit(): void {
        // Listen on project deletions to update the saved state of current project if needed
        this.deletedProjectSubscription = this.projectService.onDeleted.subscribe(name => this.handleProjectDelete(name));

        // Initialize project state from 'data' query parameter and also update the project state automatically when
        // this parameter changes
        this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(params => {
            const stateData = params.data as string;
            if (stateData != null) {
                if (stateData !== this.stateData) {
                    this.stateData = stateData;
                    this.state.setProject(this.projectService.import(this.type, stateData));
                }
            } else {
                this.stateData = "";
                this.updateRouter();
            }
        });

        // Update the URL 250 milliseconds after the project or any of its nested state has changed
        this.routerEffect = effect(onCleanup => {
            this.getProject().getRevision();
            const timer = setTimeout(() => this.updateRouter(), 250);
            onCleanup(() => clearTimeout(timer));
        }, { injector: this.injector });

        // Update URL right now with current project state
        this.updateRouter();
    }

    public ngOnDestroy(): void {
        this.routerEffect?.destroy();
        this.queryParamsSubscription?.unsubscribe();
        this.deletedProjectSubscription?.unsubscribe();
    }

    private updateRouter(): void {
        const stateData = this.projectService.export(this.getProject());
        if (stateData !== this.stateData) {
            this.stateData = stateData;
            void this.router.navigate([], { queryParams: { data: stateData }, replaceUrl: true });
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
     * @returns The current project.
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
     * @returns The project name.
     */
    public get projectName(): StringValue {
        return this.getProject().getName();
    }

    /**
     * Checks if project is saved.
     *
     * @returns True if project is saved, false if not.
     */
    public get saved(): boolean {
        return this.getProject().isSaved();
    }

    /**
     * Loads a previously saved project.
     */
    public async load(): Promise<void> {
        const name = await this.dialogService.openDialog(LoadProjectDialog, {
            init: component => {
                component.init(this.type);
            }
        });
        if (name != null) {
            this.state.setProject(this.projectService.load(this.type, name));
        }
    }

    /**
     * Saves the current project. When no project name has been entered yet then the input field is just focused
     * instead and a toast informs the user about the missing project name.
     */
    public save(): void {
        const project = this.state.getProject();
        const name = project.getName().trim();
        if (name === "") {
            this.toastService.showToast("Project needs a name to save", { type: "warning" });
            this.projectNameInput?.nativeElement.focus();
        } else {
            this.projectService.save(this.type, project);
            this.toastService.showToast(`Project '${name}' has been saved`);
        }
    }
}
