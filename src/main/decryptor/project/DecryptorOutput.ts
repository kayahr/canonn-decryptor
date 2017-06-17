/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../../utils/Serializable";
import { DecryptorNodeJSON, DecryptorNode } from "./DecryptorNode";
import { ConverterJSON, Converter } from "../converters/Converter";

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
    private converter: Converter;

    public constructor(converter: Converter) {
        super();
        this.converter = converter;
        converter.onChange.connect(this.update, this);
    }

    public static fromJSON(json: DecryptorOutputJSON): DecryptorOutput {
        const node = new DecryptorOutput(Converter.fromJSON(json.converter));
        if (json.outputs) {
            node.addOutputs(json.outputs.map(output => DecryptorOutput.fromJSON(output)));
        }
        return node;
    }

    /** @inheritDoc */
    public toJSON(): DecryptorOutputJSON {
        return Object.assign(super.toJSON(), {
            converter: this.converter.toJSON()
        });
    }

    /**
     * Returns the converter used to convert the input of the parent.
     *
     * @return The converter.
     */
    public getConverter(): Converter {
        return this.converter;
    }

    /**
     * Removes this output.
     */
    public remove(): void {
        if (this.parent) {
            this.parent.removeOutput(this);
        }
    }

    /**
     * @inheritDoc
     */
    public convert(value: string): string {
        return this.converter.convert(value);
    }
}
