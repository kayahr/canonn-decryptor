/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Serializable } from "../../utils/Serializable.ts";
import { Converter, type ConverterJSON } from "../converters/Converter.ts";
import { DecryptorNode, type DecryptorNodeJSON } from "./DecryptorNode.ts";

/**
 * JSON structure of a serialized decryptor output.
 */
export interface DecryptorOutputJSON extends DecryptorNodeJSON {
    converter: ConverterJSON;
}

/**
 * Decryptor output.
 */
export class DecryptorOutput extends DecryptorNode implements Serializable<DecryptorOutputJSON> {
    /** The converter used to convert the input of the parent. */
    private readonly converter: Converter;

    public constructor(converter: Converter) {
        super();
        this.converter = converter;
        converter.onChanged.connect(this.update, this);
    }

    public static fromJSON(json: DecryptorOutputJSON): DecryptorOutput {
        const node = new DecryptorOutput(Converter.fromJSON(json.converter));
        if (json.outputs != null) {
            node.addOutputs(json.outputs.map(output => DecryptorOutput.fromJSON(output)));
        }
        return node;
    }

    /** @inheritdoc */
    public override toJSON(): DecryptorOutputJSON {
        return Object.assign(super.toJSON(), {
            converter: this.converter.toJSON()
        });
    }

    /**
     * Returns the converter used to convert the input of the parent.
     *
     * @returns The converter.
     */
    public getConverter(): Converter {
        return this.converter;
    }

    /**
     * Removes this output.
     */
    public remove(): void {
        if (this.parent != null) {
            this.parent.removeOutput(this);
        }
    }

    /**
     * Replaces this output with the given output. Child outputs are moved to the new output.
     *
     * @param output - The output to replace this one with.
     */
    public replace(output: DecryptorOutput): void {
        if (this.parent != null) {
            this.parent.insertOutput(output, this);
            output.addOutputs(this.getOutputs());
            this.remove();
        }
    }

    /**
     * Inserts a new parent output.
     *
     * @param output - The output to insert as parent.
     */
    public insertParent(output: DecryptorOutput): void {
        if (this.parent != null) {
            this.parent.insertOutput(output, this);
            output.addOutput(this);
        }
    }

    /**
     * @inheritdoc
     */
    public convert(value: string): string {
        return this.converter.convert(value);
    }
}
