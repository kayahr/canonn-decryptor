/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter.js";

/**
 * Reverses a single character.
 *
 * @param char - The character to rotate
 * @returns The rotated character.
 */
function reverse(char: string): string {
    const base = char < "a" ? 65 : 97;
    return String.fromCharCode((25 - (char.charCodeAt(0) - base)) + base);
}

/**
 * Atbash converter.
 */
@converter<Atbash>("atbash", "atbash", "Atbash", "Converts text by reversing the alphabet.")
export class Atbash extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        return input.replace(/[a-z]/gi, reverse);
    }
}
