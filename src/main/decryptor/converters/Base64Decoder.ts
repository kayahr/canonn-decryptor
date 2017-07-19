/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";
import * as base64 from "base64-js";

/**
 * Base64 decoder.
 */
@converter("base64-decoder", "base64", "Base 64 Decoder", "Decodes base64 encoded bytes")
export class Base64Decoder extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        try {
            return Array.from(base64.toByteArray(input)).map(byte =>
                (byte < 16 ? "0" : "") + byte.toString(16)).join(" ");
        } catch (e) {
            return "DECODING ERROR: " + e.message;
        }
    }
}
