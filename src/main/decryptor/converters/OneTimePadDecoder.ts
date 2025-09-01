/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.js";
import { OneTimePadCipher } from "./OneTimePadCipher.js";

/**
 * One-time pad decoder.
 */
@converter<OneTimePadDecoder>("one-time-pad-decoder", "one-time-pad", "One-Time Pad Decoder",
    "Decodes text encrypted with a one-time pad.")
export class OneTimePadDecoder extends OneTimePadCipher {
    protected readonly direction: 1 | -1 = -1;
}
