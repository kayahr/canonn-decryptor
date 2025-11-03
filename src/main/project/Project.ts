/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Serializable, SerializableStatic } from "../utils/Serializable.ts";
import { Signal } from "../utils/Signal.ts";

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
    private readonly emitOnChanged = Signal.createEmitter();

    public readonly onChanged = this.emitOnChanged.signal;

    /** The project name. */
    private name: string;

    private saved = false;

    public constructor(name: string) {
        this.name = name;
    }

    /** @inheritdoc */
    public toJSON(): ProjectJSON {
        return {
            name: this.name
        };
    }

    /**
     * Returns the project name.
     *
     * @returns The project name.
     */
    public getName(): string {
        return this.name;
    }

    protected change(): void {
        this.saved = false;
        this.emitOnChanged();
    }

    /**
     * Checks if project is saved.
     *
     * @returns True if project is saved, false if not.
     */
    public isSaved(): boolean {
        return this.saved;
    }

    /**
     * Marks the project as saved (or resets this state if false is specified as parameter.
     *
     * @param saved  Optionally set this parameter to false to mark the project as unsaved.
     */
    public markAsSaved(saved = true): void {
        this.saved = saved;
    }

    /**
     * Sets the project name.
     *
     * @param name  The project name to set.
     */
    public setName(name: string): void {
        name = name.trim();
        if (name !== this.name) {
            this.name = name;
            this.change();
        }
    }
}
