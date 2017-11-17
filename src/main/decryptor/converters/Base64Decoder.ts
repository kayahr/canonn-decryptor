/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";
import * as base64 from "base64-js";
import { selectOption } from "./options/SelectOption";

/**
 * Base64 decoder.
 */
@converter<Base64Decoder>("base64-decoder", "base64", "Base 64 Decoder", "Decodes base64 encoded text or bytes")
export class Base64Decoder extends Converter {
    /** The output type. */
    @selectOption<Base64Decoder>("output", "Output", [
        { value: "text", label: "Plain-Text" },
        { value: "bytes", label: "Bytes in HEX" }
    ], { defaultValue: "text" })
    protected output: string;

    /** @inheritDoc */
    public convert(input: string): string {
        let decoded: number[];
        try {
            decoded = Array.from(base64.toByteArray(input));
        } catch (e) {
            return "DECODING ERROR: " + e.message;
        }

        if (this.output === "text") {
            return decoded.map(byte => String.fromCharCode(byte)).join("");
        } else {
            return decoded.map(byte => (byte < 16 ? "0" : "") + byte.toString(16)).join(" ");
        }
    }
}
