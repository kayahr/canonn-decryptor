/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.ts";
import { VigenereCipher } from "./VigenereCipher.ts";

/**
 * Vigenère encoder.
 */
@converter<VigenereEncoder>("vigenere-encoder", "vigenere", "Vigenère Encoder", "Encrypts text with the Vigenère cipher</a>")
export class VigenereEncoder extends VigenereCipher {
    /** @inheritdoc */
    protected convertChar(char: number, key: number): number {
        return (char + key) % 26;
    }
}
