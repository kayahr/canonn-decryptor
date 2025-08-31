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
    /**
     * Creates a new one-time pad decoder with the given pad characters.
     *
     * @param pad  Optional initial pad characters to encode with. Defaults to no pad when not specified.
     */
    public constructor(pad?: string) {
        super(1, pad);
    }
}
