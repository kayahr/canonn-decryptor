/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.js";
import { VigenereCipher } from "./VigenereCipher.js";

/**
 * Vigenère decoder.
 */
@converter<VigenereDecoder>("vigenere-decoder", "vigenere", "Vigenère Decoder",
    "Decodes text encrypted with the Vigenère square.")
export class VigenereDecoder extends VigenereCipher {
    /** @inheritDoc */
    protected convertChar(char: number, key: number): number {
        return (char - key + 26) % 26;
    }
}
