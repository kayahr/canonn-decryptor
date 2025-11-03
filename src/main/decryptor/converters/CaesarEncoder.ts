/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CaesarCipher } from "./CaesarCipher.ts";
import { converter } from "./Converter.ts";

/**
 * Converter for caesar encoding.
 */
@converter<CaesarEncoder>("caesar-encoder", "caesar", "Caesar Encoder", "Encodes text with simple alphabet rotation.")
export class CaesarEncoder extends CaesarCipher<CaesarEncoder> {
    protected readonly direction = 1;
}
