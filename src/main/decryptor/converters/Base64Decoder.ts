/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import base64 from "base64-js";

import { getErrorMessage } from "../../utils/error.ts";
import { fromByteArray } from "../../utils/string.ts";
import { Converter, converter } from "./Converter.ts";
import { selectOption } from "./options/SelectOption.ts";

export type Base64OutputType = "txt" | "dec" | "hex" | "bin";

function toBin(byte: number): string {
    const s = `00000000${byte.toString(2)}`;
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
export class Base64Decoder extends Converter<Base64Decoder> {
    /** The output type. */
    @selectOption<Base64Decoder>("output", "Output", [
        { value: "txt", label: "Plain-Text" },
        { value: "dec", label: "Bytes (Decimal)" },
        { value: "hex", label: "Bytes (Hex)" },
        { value: "bin", label: "Bytes (Binary)" }
    ], { defaultValue: "txt" })
    public output!: Base64OutputType;

    /** @inheritdoc */
    public convert(input: string): string {
        let decoded: number[];
        try {
            decoded = Array.from(base64.toByteArray(input.replace(/\s+/g, "")));
        } catch (error) {
            return `DECODING ERROR: ${getErrorMessage(error)}`;
        }

        switch (this.output) {
            case "bin":
                return decoded.map(toBin).join(" ");

            case "dec":
                return decoded.map(toDec).join(" ");

            case "hex":
                return decoded.map(toHex).join(" ");

            case "txt":
                return fromByteArray(decoded);
        }
    }
}
