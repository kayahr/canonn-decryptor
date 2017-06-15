/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";

/**
 * Rotates a single character using the given character base.
 *
 * @param char  The character to rotate
 * @return The rotated character.
 */
function rotate(char: string): string {
    const base = char < "a" ? 64 : 97;
    return String.fromCharCode(((((char.charCodeAt(0) - base) + 13) % 26) + 26) % 26 + base);
}

/**
 * ROT 13 converter.
 */
@converter("rot13", "rot13", "Rot 13", "Converts text by rotating the alphabet by 13.")
export class Rot13 extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        return input.replace(/[a-zA-Z]/g, rotate);
    }
}
