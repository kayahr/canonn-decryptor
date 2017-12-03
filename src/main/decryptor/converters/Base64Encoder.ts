/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";
import * as base64 from "base64-js";
import { toByteArray } from "../../utils/string";

/**
 * Base64 encoder.
 */
@converter<Base64Encoder>("base64-encoder", "base64", "Base64 Encoder", "Encodes plain text with Base64.")
export class Base64Encoder extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        try {
            return base64.fromByteArray(toByteArray(input)).replace(/(.{76})/g, "$1\n");
        } catch (e) {
            return "ENCODING ERROR: " + e.message;
        }
    }
}
