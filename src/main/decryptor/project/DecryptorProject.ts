/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isProjectJSON, Project, type ProjectJSON } from "../../project/Project.js";
import { IllegalArgumentError } from "../../utils/error.js";
import { type Serializable } from "../../utils/Serializable.js";
import { DecryptorInput, type DecryptorInputJSON } from "./DecryptorInput.js";

/**
 * JSON structure of a serialized decryptor project.
 */
export interface DecryptorProjectJSON extends ProjectJSON {
    inputs: DecryptorInputJSON[];
}

/**
 * Checks if given JSON is a serialized decryptor project.
 *
 * @param json  The JSON to check.
 * @return True if JSON is a serialized decryptor project, false if not.
 */
export function isDecryptorProjectJSON(json: unknown): json is DecryptorProjectJSON {
    return json instanceof Object && (json as DecryptorProjectJSON).inputs instanceof Array && isProjectJSON(json);
}

/**
 * Decryptor project.
 */
export class DecryptorProject extends Project implements Serializable<DecryptorProjectJSON> {
    /** The decryptor inputs. */
    private readonly inputs: DecryptorInput[];

    public constructor(name: string = "") {
        super(name);
        this.inputs = [];
    }

    /**
     * Returns the project type. Used for generic project load/save.
     *
     * @return The project type.
     */
    public static getProjectType(): string {
        return "decryptor";
    }

    /**
     * Checks if the given JSON describes a decryptor project.
     *
     * @param json  The JSON to check.
     * @return True if JSON is a serialized decryptor project, false if not.
     */
    public static isProjectJSON(json: unknown): json is DecryptorProjectJSON {
        return isDecryptorProjectJSON(json);
    }

    public static fromJSON(json: DecryptorProjectJSON): DecryptorProject {
        const project = new DecryptorProject(json.name);
        project.addInputs(json.inputs.map(input => DecryptorInput.fromJSON(input)));
        return project;
    }

    /** @inheritDoc */
    public override toJSON(): DecryptorProjectJSON {
        return Object.assign(super.toJSON(), {
            inputs: this.inputs.map(input => input.toJSON())
        });
    }

    /**
     * Adds a new input.
     *
     * @param input  The input add. A new empty input is generated when not specified.
     */
    public addInput(input: DecryptorInput = new DecryptorInput()): void {
        this.inputs.push(input);
        input.onChanged.connect(this.change, this);
        this.change();
    }

    /**
     * Adds the given inputs.
     *
     * @param inputs  The inputs to add.
     */
    public addInputs(inputs: DecryptorInput[]): void {
        for (const input of inputs) {
            this.addInput(input);
        }
    }

    /**
     * Removes the given input.
     *
     * @param input  The input to remove.
     * @throws IllegalArgumentError  When input was not found.
     */
    public removeInput(input: DecryptorInput): void {
        const index = this.inputs.indexOf(input);
        if (index === -1) {
            throw new IllegalArgumentError("Input to remove not found");
        }
        this.inputs.splice(index, 1);
        input.onChanged.disconnect(this.change, this);
        this.change();
    }

    /**
     * Returns the decryptor inputs.
     *
     * @return The decryptor inputs.
     */
    public getInputs(): DecryptorInput[] {
        return this.inputs.slice();
    }

    /**
     * Checks if the project is in its initial empty state.
     *
     * A project is considered empty when:
     *
     * - The project name is empty
     * - There is exactly one input
     * - The input text is empty
     * - The input has no outputs
     *
     * @returns True if project is empty, false otherwise.
     */
    public isEmpty(): boolean {
        if (this.getName().trim() !== "") return false;
        if (this.inputs.length !== 1) return false;
        const input = this.inputs[0];
        if (input.getInput() !== "") return false;
        return input.getOutputs().length === 0;
    }

    /**
     * Clears the project by removing all inputs, adding a new empty input and resetting the name.
     */
    public clear(): void {
        for (const input of this.getInputs()) {
            this.removeInput(input);
        }
        this.setName("");
        this.addInput();
    }
}
