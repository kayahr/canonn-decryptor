/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.js";
import { OneTimePadCipher } from "./OneTimePadCipher.js";

/**
 * One-time pad decoder.
 */
@converter<OneTimePadEncoder>("one-time-pad-encoder", "one-time-pad", "One-Time Pad Encoder",
    "Encodes text with a one-time pad.")
export class OneTimePadEncoder extends OneTimePadCipher {
    protected readonly direction: 1 | -1 = 1;
}
