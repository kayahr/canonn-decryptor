/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter";
import { VigenereCipher } from "./VigenereCipher";

/**
 * Vigènere encoder.
 */
@converter<VigenereEncoder>("vigenere-encoder", "vigenere", "Vigènere Encoder",
    "Encodes text encrypted with the Vigènere square.")
export class VigenereEncoder extends VigenereCipher {
    /** @inheritDoc */
    protected convertChar(char: number, key: number): number {
        return (char + key) % 26;
    }
}
