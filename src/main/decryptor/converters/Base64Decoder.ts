/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import base64 from "base64-js";

import { getErrorMessage } from "../../utils/error.js";
import { fromByteArray } from "../../utils/string.js";
import { Converter, converter } from "./Converter.js";
import { selectOption } from "./options/SelectOption.js";

export enum Base64OutputType {
    TXT = "txt",
    DEC = "dec",
    HEX = "hex",
    BIN = "bin"
}

function toBin(byte: number): string {
    const s = "00000000" + byte.toString(2);
    return s.substring(s.length - 8);
}

function toDec(byte: number): string {
    return byte.toString(10);
}

function toHex(byte: number): string {
    return (byte < 16 ? "0" : "") + byte.toString(16);
}

/**
 * Base64 decoder.
 */
@converter<Base64Decoder>("base64-decoder", "base64", "Base64 Decoder", "Decodes Base64 encoded text or bytes.")
export class Base64Decoder extends Converter {
    /** The output type. */
    @selectOption<Base64Decoder>("output", "Output", [
        { value: Base64OutputType.TXT, label: "Plain-Text" },
        { value: Base64OutputType.DEC, label: "Bytes (Decimal)" },
        { value: Base64OutputType.HEX, label: "Bytes (Hex)" },
        { value: Base64OutputType.BIN, label: "Bytes (Binary)" }
    ], { defaultValue: Base64OutputType.TXT })
    protected outputType: Base64OutputType = Base64OutputType.TXT;

    /**
     * @param output   Optional initial output type. Defaults to "text".
     */
    public constructor(output?: Base64OutputType) {
        super();
        if (output != null) {
            this.outputType = output;
        }
    }

    /**
     * Sets the output type.
     *
     * @param outputType  The output type to set.
     */
    public setOutputType(outputType: Base64OutputType): void {
        this.outputType = outputType;
    }

    /**
     * Returns the output type.
     *
     * @return The output type.
     */
    public getOutputType(): Base64OutputType {
        return this.outputType;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        let decoded: number[];
        try {
            decoded = Array.from(base64.toByteArray(input.replace(/\s+/g, "")));
        } catch (e) {
            return "DECODING ERROR: " + getErrorMessage(e);
        }

        switch (this.outputType) {
            case Base64OutputType.BIN:
                return decoded.map(toBin).join(" ");

            case Base64OutputType.DEC:
                return decoded.map(toDec).join(" ");

            case Base64OutputType.HEX:
                return decoded.map(toHex).join(" ");

            case Base64OutputType.TXT:
                return fromByteArray(decoded);
        }
    }
}
