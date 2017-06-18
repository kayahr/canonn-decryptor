/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../../utils/Serializable";
import { DecryptorOutputJSON, DecryptorOutput } from "./DecryptorOutput";
import { Signal } from "../../utils/Signal";
import { IllegalStateError, IllegalArgumentError } from "../../utils/error";

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
    /**
     * Emitted when the node has been changed.
     *
     * @event
     */
    public onChanged = new Signal<this>();

    /** The parent decryptor node (input or output) or null if none. */
    protected parent: DecryptorNode | null = null;

    /** The outputs connected to this node. */
    protected outputs: DecryptorOutput[];

    /** The current decryptor node value. */
    private value: string = "";

    public constructor() {
        this.outputs = [];
    }

    /**
     * Emits the onChanged event.
     */
    protected change(): void {
        this.onChanged.emit(this);
    }

    /** @inheritDoc */
    public toJSON(): DecryptorNodeJSON {
        const json: DecryptorNodeJSON = {};
        if (this.outputs.length) {
            json.outputs = this.outputs.map(node => node.toJSON());
        }
        return json;
    }

    /**
     * Abstract method decryptor nodes must implement to convert the given input value to an output value.
     *
     * @param value  The input value.
     * @return The output value.
     */
    public abstract convert(value: string): string;

    /**
     * Updates the node value by internally calling the [[convert]] method. If value has been changed then child
     * outputs are also updated.
     */
    protected update(): void {
        const newValue = this.convert(this.parent ? this.parent.getValue() : "");
        if (newValue !== this.value) {
            this.value = newValue;
            for (const output of this.outputs) {
                output.update();
            }
        }
        this.onChanged.emit(this);
    }

    /**
     * Returns the value of this input/output.
     *
     * @return The current value.
     */
    public getValue(): string {
        return this.value;
    }

    /**
     * Returns the parent node of this node.
     *
     * @return The parent node.
     * @throws IllegalStateError  When node has no parent node.
     */
    public getParent(): DecryptorNode {
        if (!this.parent) {
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
        this.outputs.push(output);
        output.setParent(this);
        output.onChanged.connect(this.change, this);
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
        const index = this.outputs.indexOf(output);
        if (index === -1) {
            throw new IllegalArgumentError("Output to remove not found");
        }
        this.outputs.splice(index, 1);
        output.setParent(null);
        output.onChanged.disconnect(this.change, this);
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
        const index = this.outputs.indexOf(reference);
        if (index === -1) {
            throw new IllegalArgumentError("Insertion reference not found");
        }
        output.remove();
        this.outputs.splice(index, 0, output);
        output.setParent(this);
        output.onChanged.connect(this.change, this);
        this.change();
    }

    /**
     * Returns the outputs connected to this node.
     *
     * @return The outputs.
     */
    public getOutputs(): DecryptorOutput[] {
        return this.outputs.slice();
    }
}
