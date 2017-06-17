/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter";
import { CaesarCipher } from "./CaesarCipher";

/**
 * Converter for caesar encoding.
 */
@converter("caesar-encoder", "caesar", "Caesar Encoder", "Encodes text with simple alphabet rotation.")
export class CaesarEncoder extends CaesarCipher {
    protected readonly direction = 1;
}
