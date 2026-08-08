/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type WritableSignal, computed, signal } from "@angular/core";

import type { Serializable, SerializableStatic } from "../utils/Serializable.ts";

/**
 * Base JSON structure for a project.
 */
export interface ProjectJSON {
    name: string;
}

/**
 * Checks if given JSON defines a project.
 */
export function isProjectJSON(json: unknown): json is ProjectJSON {
    return (json instanceof Object) && typeof (json as ProjectJSON).name === "string";
}

/**
 * Interface for constructors of classes which can be deserialized.
 */
export interface ProjectStatic<T extends Project> extends SerializableStatic<T> {
    new (...args: any[]): T;

    getProjectType(): string;

    /**
     * Deserializes the object by using the specified JSON data.
     *
     * @param json  The serialized JSON data.
     * @returns The deserialized object.
     */
    isProjectJSON(json: unknown): json is ProjectJSON;
}

/**
 * Abstract base class for projects.
 */
export abstract class Project implements Serializable<ProjectJSON> {
    /** The project name. */
    private readonly name: WritableSignal<string>;

    /** Token identifying the last direct change of this project. */
    private readonly ownRevision = signal<object>({});

    /** Token identifying the current state of this project including all nested state. */
    private readonly revision = computed(() => {
        this.ownRevision();
        this.trackChanges();
        return {};
    });

    /** Revision at which the project was last saved. Null means explicitly unsaved. */
    private readonly savedRevision = signal<object | null>(null);

    public constructor(name: string) {
        this.name = signal(name);
    }

    /** @inheritdoc */
    public toJSON(): ProjectJSON {
        return {
            name: this.name()
        };
    }

    /**
     * Returns the project name.
     *
     * @returns The project name.
     */
    public getName(): string {
        return this.name();
    }

    /**
     * Tracks additional state owned by subclasses. All signals read by this method become part of the project
     * revision.
     */
    protected trackChanges(): void {}

    /** Marks the project as changed. */
    protected change(): void {
        this.ownRevision.set({});
    }

    /**
     * Returns a stable token for the current project revision. The token changes whenever this project or any
     * nested project state changes.
     *
     * @returns The current project revision token.
     */
    public getRevision(): object {
        return this.revision();
    }

    /**
     * Checks if project is saved.
     *
     * @returns True if project is saved, false if not.
     */
    public isSaved(): boolean {
        return this.savedRevision() === this.getRevision();
    }

    /**
     * Marks the project as saved (or resets this state if false is specified as parameter.
     *
     * @param saved  Optionally set this parameter to false to mark the project as unsaved.
     */
    public markAsSaved(saved = true): void {
        this.savedRevision.set(saved ? this.getRevision() : null);
    }

    /**
     * Sets the project name.
     *
     * @param name  The project name to set.
     */
    public setName(name: string): void {
        name = name.trim();
        if (name !== this.name()) {
            this.name.set(name);
            this.change();
        }
    }
}
