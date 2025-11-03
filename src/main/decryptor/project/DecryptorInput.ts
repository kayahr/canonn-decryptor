/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Serializable } from "../../utils/Serializable.ts";
import { DecryptorNode, type DecryptorNodeJSON } from "./DecryptorNode.ts";
import { DecryptorOutput } from "./DecryptorOutput.ts";

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
        if (json.input != null) {
            node.setInput(json.input);
        }
        if (json.outputs != null) {
            node.addOutputs(json.outputs.map(output => DecryptorOutput.fromJSON(output)));
        }
        return node;
    }

    /** @inheritdoc */
    public override toJSON(): DecryptorInputJSON {
        return Object.assign(super.toJSON(), {
            input: this.input
        });
    }

    /**
     * Returns the input data.
     *
     * @returns The input data.
     */
    public getInput(): string {
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
            this.update();
            this.change();
        }
    }

    /** @inheritdoc */
    public convert(value: string): string {
        return this.getInput();
    }
}
