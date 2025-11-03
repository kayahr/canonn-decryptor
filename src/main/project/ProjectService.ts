/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable } from "@angular/core";
import lz from "lz-string";

import { IllegalArgumentError } from "../utils/error.ts";
import { Signal } from "../utils/Signal.ts";
import type { Project, ProjectJSON, ProjectStatic } from "./Project.ts";

/**
 * Forgot to rename the key after renaming the project. Existing projects under this key are migrated to the new
 * key so hopefully I can remove this code some day.
 */
function deprecatedItemKey<T extends Project>(type: ProjectStatic<T>): string {
    return `canonn-little-helper.${type.getProjectType()}.projects`;
}

function itemKey<T extends Project>(type: ProjectStatic<T>): string {
    return `canonn-decryptor.${type.getProjectType()}.projects`;
}

/**
 * Service for loading, saving, deleting, importing and exporting projects.
 */
@Injectable({ providedIn: "root" })
export class ProjectService {
    private readonly emitOnDeleted = Signal.createEmitter<string>();

    /**
     * Signal is triggered when a project has been deleted.
     *
     * @event
     */
    public readonly onDeleted = this.emitOnDeleted.signal;

    /**
     * Loads all projects and returns them.
     *
     * @returns The loaded projects.
     */
    public loadProjects<T extends Project>(type: ProjectStatic<T>): T[] {
        const key = itemKey(type);
        const item = localStorage.getItem(key);
        let projects: T[];
        if (item != null) {
            const json = JSON.parse(item) as ProjectJSON[];
            projects = json.map(type.fromJSON);
        } else {
            projects = [];
        }

        // If projects are found under deprecated key then move them to new key. I hope I can remove this
        // code someday...
        const deprecatedKey = deprecatedItemKey(type);
        const deprecatedItem = localStorage.getItem(deprecatedKey);
        if (deprecatedItem != null) {
            const json = JSON.parse(deprecatedItem) as ProjectJSON[];
            const deprecatedProjects = json.map(type.fromJSON);
            for (const project of deprecatedProjects) {
                projects.push(project);
            }
            localStorage.removeItem(deprecatedKey);
            this.saveProjects(type, projects);
        }

        return projects;
    }

    /**
     * Loads the project with the given name.
     *
     * @param name  The name of the project to load.
     * @returns The loaded project.
     */
    public load<T extends Project>(type: ProjectStatic<T>, name: string): T {
        const projects = this.loadProjects(type);
        for (const project of projects) {
            if (project.getName() === name) {
                project.markAsSaved();
                return project;
            }
        }
        throw new IllegalArgumentError(`Project not found: ${name}`);
    }

    /**
     * Saves the given projects.
     *
     * @param projects  The projects to save.
     */
    private saveProjects<T extends Project>(type: ProjectStatic<T>, projects: Project[]): void {
        const json = projects.map(project => project.toJSON());
        localStorage.setItem(itemKey(type), JSON.stringify(json));
    }

    /**
     * Deletes the project with the given name.
     *
     * @param name  The name of the project to delete.
     */
    public deleteProject<T extends Project>(type: ProjectStatic<T>, name: string): void {
        const projects = this.loadProjects(type);
        this.saveProjects(type, projects.filter(project => project.getName() !== name));
        this.emitOnDeleted(name);
    }

    /**
     * Saves the given project.
     *
     * @param project  The project to save.
     */
    public save<T extends Project>(type: ProjectStatic<T>, project: T): void {
        const projects = this.loadProjects(type).filter(existing => existing.getName() !== project.getName());
        projects.push(project);
        this.saveProjects(type, projects);
        project.markAsSaved();
    }

    /**
     * Exports the given project into a string.
     *
     * @param project  The project to export.
     * @returns The export string.
     */
    public export<T extends Project>(project: T): string {
        return lz.compressToBase64(JSON.stringify(project.toJSON()));
    }

    /**
     * Imports a project and returns it.
     *
     * @param type  The type of project to import.
     * @returns The imported project or null if none.
     */
    public import<T extends Project>(type: ProjectStatic<T>, data: string): T {
        const json = JSON.parse(lz.decompressFromBase64(data)) as unknown;
        if (!type.isProjectJSON(json)) {
            throw new IllegalArgumentError("Import data is not a valid decryptor project");
        }
        return type.fromJSON(json);
    }
}
