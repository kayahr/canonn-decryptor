/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { computed, signal } from "@angular/core";

import { IllegalArgumentError, IllegalStateError } from "../../utils/error.ts";
import type { Serializable } from "../../utils/Serializable.ts";
import type { DecryptorOutput, DecryptorOutputJSON } from "./DecryptorOutput.ts";

/**
 * JSON structure of a serialized decryptor node.
 */
export interface DecryptorNodeJSON {
    outputs?: DecryptorOutputJSON[];
}

/**
 * Shared abstract base class for decryptor inputs and outputs.
 */
export abstract class DecryptorNode implements Serializable<DecryptorNodeJSON> {
    /** The parent decryptor node (input or output) or null if none. */
    protected parent: DecryptorNode | null = null;

    /** The outputs connected to this node. */
    private readonly outputs = signal<readonly DecryptorOutput[]>([]);

    /** The current decryptor node value. */
    private readonly value = signal("");

    /** Token identifying the last direct change of this node. */
    private readonly ownRevision = signal<object>({});

    /** Token identifying the current state of this node including all nested outputs. */
    private readonly revision = computed(() => {
        this.ownRevision();
        for (const output of this.outputs()) {
            output.getRevision();
        }
        this.trackChanges();
        return {};
    });

    /** Marks this node as changed. */
    protected change(): void {
        this.ownRevision.set({});
    }

    /** Tracks additional state owned by subclasses. */
    protected trackChanges(): void {}

    /**
     * Returns a stable token for the current node revision.
     *
     * @returns The current node revision token.
     */
    public getRevision(): object {
        return this.revision();
    }

    /** @inheritdoc */
    public toJSON(): DecryptorNodeJSON {
        const json: DecryptorNodeJSON = {};
        const outputs = this.outputs();
        if (outputs.length > 0) {
            json.outputs = outputs.map(node => node.toJSON());
        }
        return json;
    }

    /**
     * Abstract method decryptor nodes must implement to convert the given input value to an output value.
     *
     * @param value  The input value.
     * @returns The output value.
     */
    public abstract convert(value: string): string;

    /**
     * Updates the node value by internally calling the [[convert]] method. If value has been changed then child
     * outputs are also updated.
     */
    protected update(): void {
        const newValue = this.convert(this.parent != null ? this.parent.getValue() : "");
        if (newValue !== this.value()) {
            this.value.set(newValue);
            for (const output of this.outputs()) {
                output.update();
            }
        }
    }

    /**
     * Returns the value of this input/output.
     *
     * @returns The current value.
     */
    public getValue(): string {
        return this.value();
    }

    /**
     * Returns the parent node of this node.
     *
     * @returns The parent node.
     * @throws IllegalStateError  When node has no parent node.
     */
    public getParent(): DecryptorNode {
        if (this.parent == null) {
            throw new IllegalStateError("Node has no parent");
        }
        return this.parent;
    }

    /**
     * Sets or removes the parent node.
     *
     * @param parent  The parent node to set or remove.
     */
    protected setParent(parent: DecryptorNode | null): void {
        if (parent !== this.parent) {
            this.parent = parent;
            this.update();
        }
    }

    /**
     * Adds the specified output to this node.
     *
     * @param output  The output to add.
     */
    public addOutput(output: DecryptorOutput): void {
        output.remove();
        this.outputs.update(outputs => [ ...outputs, output ]);
        output.setParent(this);
        this.change();
    }

    /**
     * Adds the specified outputs to this node.
     *
     * @param outputs  The outputs to add.
     */
    public addOutputs(outputs: DecryptorOutput[]): void {
        for (const output of outputs) {
            this.addOutput(output);
        }
    }

    /**
     * Removes the specified output from this node.
     *
     * @param output  The output to remove.
     * @throws IllegalArgumentError  When output was not found.
     */
    public removeOutput(output: DecryptorOutput): void {
        const outputs = this.outputs();
        const index = outputs.indexOf(output);
        if (index === -1) {
            throw new IllegalArgumentError("Output to remove not found");
        }
        this.outputs.set([ ...outputs.slice(0, index), ...outputs.slice(index + 1) ]);
        output.setParent(null);
        this.change();
    }

    /**
     * Inserts the specified output before the given reference output.
     *
     * @param output     The output to insert.
     * @param reference  The reference output in front of which the new output is inserted.
     * @throws IllegalArgumentError  When reference output was not found.
     */
    public insertOutput(output: DecryptorOutput, reference: DecryptorOutput): void {
        const outputs = this.outputs();
        const index = outputs.indexOf(reference);
        if (index === -1) {
            throw new IllegalArgumentError("Insertion reference not found");
        }
        output.remove();
        const currentOutputs = this.outputs();
        this.outputs.set([ ...currentOutputs.slice(0, index), output, ...currentOutputs.slice(index) ]);
        output.setParent(this);
        this.change();
    }

    /**
     * Returns the outputs connected to this node.
     *
     * @returns The outputs.
     */
    public getOutputs(): DecryptorOutput[] {
        return this.outputs().slice();
    }
}
