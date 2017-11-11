/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter";
import { VigenereCipher } from "./VigenereCipher";

/**
 * Vigènere decoder.
 */
@converter<VigenereDecoder>("vigenere-decoder", "vigenere", "Vigènere Decoder",
    "Decodes text encrypted with the Vigènere square.")
export class VigenereDecoder extends VigenereCipher {
    /** @inheritDoc */
    protected convertChar(char: number, key: number): number {
        return (char - key + 26) % 26;
    }
}
