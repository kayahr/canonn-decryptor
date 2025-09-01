/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { unescape } from "../../utils/string.js";
import { Converter, converter } from "./Converter.js";
import { numberOption } from "./options/NumberOption.js";
import { selectOption } from "./options/SelectOption.js";
import { stringOption } from "./options/StringOption.js";

/** How to handle whitespaces. */
export type WhitespaceHandling = "keep" | "discard" | "encode";

/**
 * Number encoder.
 */
@converter<NumberEncoder>("number-encoder", "number", "Number Encoder",
    "Encodes ASCII characters into numbers. Supports base 2 to 36 and value shifting.")
export class NumberEncoder extends Converter<NumberEncoder> {
    /** The number base. */
    @numberOption<NumberEncoder>("base", "Base", {
        min: 2,
        max: 36,
        defaultValue: 10
    })
    public base!: number;

    /** The padding. */
    @numberOption<NumberEncoder>("length", "Length", {
        min: 1,
        max: 32,
        defaultValue: 1
    })
    public length!: number;

    /** The number shift. */
    @numberOption<NumberEncoder>("shift", "Shift", { defaultValue: -64 })
    public shift!: number;

    /** The separator. */
    @stringOption<NumberEncoder>("separator", "Separator", { defaultValue: " " })
    public separator!: string;

    /** Whitespace handling: keep, discard or encode. */
    @selectOption<NumberEncoder>("whitespace", "Whitespace", [
        { value: "keep", label: "Keep" },
        { value: "discard", label: "Discard" },
        { value: "encode", label: "Encode" }
    ], { defaultValue: "keep" })
    public whitespace!: WhitespaceHandling;

    /** @inheritDoc */
    public convert(input: string): string {
        const { whitespace, shift, base, length } = this;
        const separator = unescape(this.separator);
        let result = "";

        for (const char of input) {
            if (whitespace !== "encode" && /\s/.test(char)) {
                if (whitespace === "keep") {
                    if (separator.length > 0 && result.endsWith(separator) && separator !== char) {
                        result = result.substring(0, result.length - separator.length);
                    }
                    result += char;
                }
            } else {
                const code = char.charCodeAt(0) + shift;
                if (code < 0) {
                    result += "-";
                }
                result += Math.abs(code).toString(base).padStart(length, "0") + separator;
            }
        }

        if (separator.length > 0 && result.endsWith(separator)) {
            result = result.substring(0, result.length - separator.length);
        }

        return result;
    }
}
