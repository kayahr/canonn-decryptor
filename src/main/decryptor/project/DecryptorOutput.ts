/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type Serializable } from "../../utils/Serializable.js";
import { Converter, type ConverterJSON } from "../converters/Converter.js";
import { DecryptorNode, type DecryptorNodeJSON } from "./DecryptorNode.js";

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

    /** @inheritDoc */
    public override toJSON(): DecryptorOutputJSON {
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
        if (this.parent != null) {
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
