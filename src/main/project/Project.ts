/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable, SerializableStatic } from "../utils/Serializable";
import { Signal } from "../utils/Signal";

/**
 * Base JSON structure for a project.
 */
export interface ProjectJSON {
    name: string;
}

/**
 * Checks if given JSON defines a project.
 */
export function isProjectJSON(json: any): json is ProjectJSON {
    return (json instanceof Object) && typeof json.name === "string";
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
     * @return The deserialized object.
     */
    isProjectJSON(json: any): json is ProjectJSON;
}

/**
 * Abstract base class for projects.
 */
export abstract class Project implements Serializable<ProjectJSON> {
    public onChanged = new Signal<void>();

    /** The project name. */
    private name: string;

    private saved: boolean = false;

    public constructor(name: string) {
        this.name = name;
    }

    /** @inheritDoc */
    public toJSON(): ProjectJSON {
        return {
            name: this.name
        };
    }

    /**
     * Returns the project name.
     *
     * @return The project name.
     */
    public getName(): string {
        return this.name;
    }

    protected change(): void {
        this.saved = false;
        this.onChanged.emit(undefined);
    }

    /**
     * Checks if project is saved.
     *
     * @return True if project is saved, false if not.
     */
    public isSaved(): boolean {
        return this.saved;
    }

    /**
     * Marks the project has saved (or resets this state if false is specified as parameter.
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
