/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CaesarCipher } from "./CaesarCipher";
import { converter } from "./Converter";

/**
 * Converter for caesar decoding.
 */
@converter("caesar-decoder", "caesar", "Caesar Decoder", "Decodes text encrypted by simple alphabet rotation.")
export class CaesarDecoder extends CaesarCipher {
    protected readonly direction = 1;
}
