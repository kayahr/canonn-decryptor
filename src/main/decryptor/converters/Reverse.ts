/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";

/**
 * Reverses the given string.
 *
 * @param s  The string to reverse.
 * @return  The reversed string.
 */
function reverse(s: string): string {
    return s.split("").reverse().join("");
}

/**
 * Reverse converter.
 */
@converter("reverse", "Reverse", "Reverse", "Reverses the text.")
export class Reverse extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        return reverse(input.replace(/(\r\n|\n\r)/g, reverse));
    }
}
