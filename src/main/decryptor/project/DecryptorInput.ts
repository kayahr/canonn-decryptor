/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../../utils/Serializable";
import { DecryptorNodeJSON, DecryptorNode } from "./DecryptorNode";
import { DecryptorOutput } from "./DecryptorOutput";

/**
 * JSON structure of a serialized decryptor input.
 */
export interface DecryptorInputJSON extends DecryptorNodeJSON {
    input?: string;
}

/**
 * Decryptor input
 */
export class DecryptorInput extends DecryptorNode implements Serializable<DecryptorInputJSON> {
    /** The input data. */
    private input: string;

    public constructor() {
        super();
        this.input = "";
    }

    public static fromJSON(json: DecryptorInputJSON): DecryptorInput {
        const node = new DecryptorInput();
        if (json.input) {
            node.setInput(json.input);
        }
        if (json.outputs) {
            node.addOutputs(json.outputs.map(output => DecryptorOutput.fromJSON(output)));
        }
        return node;
    }

    /** @inheritDoc */
    public toJSON(): DecryptorInputJSON {
        return Object.assign(super.toJSON(), {
            input: this.input
        });
    }

    /**
     * Returns the input data.
     *
     * @return The input data.
     */
    public getInput() {
        return this.input;
    }

    /**
     * Sets the input data.
     *
     * @param input  The input data to set.
     */
    public setInput(input: string): void {
        if (input !== this.input) {
            this.input = input;
            this.change();
        }
    }

    /** @inheritDoc */
    public getValue(): string {
        return this.getInput();
    }
}
