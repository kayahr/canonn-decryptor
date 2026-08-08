/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type WritableSignal, signal } from "@angular/core";

import type { Project } from "./Project.ts";

/**
 * Abstract base class for an injectable state object which holds a project.
 */
export abstract class ProjectState<T extends Project> {
    /** The current project within the state. */
    private readonly project: WritableSignal<T>;

    /**
     * Creates a new state object holding the specified initial project.
     *
     * @param project  The initial project to put into the state.
     */
    protected constructor(project: T) {
        this.project = signal(project);
    }

    /**
     * Returns the current project.
     *
     * @returns The current project.
     */
    public getProject(): T {
        return this.project();
    }

    /**
     * Replaces the project within this state with the given one.
     *
     * @param project  The new project to set.
     */
    public setProject(project: T): void {
        this.project.set(project);
    }
}
