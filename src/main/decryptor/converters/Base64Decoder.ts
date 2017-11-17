/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";
import * as base64 from "base64-js";
import { selectOption } from "./options/SelectOption";
import { fromByteArray } from "../../utils/string";

export enum Base64OutputType {
    TEXT = "text",
    BYTES = "bytes"
}

/**
 * Base64 decoder.
 */
@converter<Base64Decoder>("base64-decoder", "base64", "Base64 Decoder", "Decodes Base64 encoded text or bytes.")
export class Base64Decoder extends Converter {
    /** The output type. */
    @selectOption<Base64Decoder>("output", "Output", [
        { value: Base64OutputType.TEXT, label: "Plain-Text" },
        { value: Base64OutputType.BYTES, label: "Bytes in HEX" }
    ], { defaultValue: "text" })
    protected outputType: Base64OutputType;

    /**
     * @param output   Optional initial output type. Defaults to "text".
     */
    public constructor(output?: Base64OutputType) {
        super();
        if (output) {
            this.outputType = output;
        }
    }

    /**
     * Sets the output type.
     *
     * @param outputType  The output type to set.
     */
    public setOutputType(outputType: Base64OutputType) {
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
            return "DECODING ERROR: " + e.message;
        }

        if (this.outputType === "text") {
            return fromByteArray(decoded);
        } else {
            return decoded.map(byte => (byte < 16 ? "0" : "") + byte.toString(16)).join(" ");
        }
    }
}
