/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import base64 from "base64-js";

import { getErrorMessage } from "../../utils/error.ts";
import { toByteArray } from "../../utils/string.ts";
import { Converter, converter } from "./Converter.ts";

/**
 * Base64 encoder.
 */
@converter<Base64Encoder>("base64-encoder", "base64", "Base64 Encoder", "Encodes plain text with Base64.")
export class Base64Encoder extends Converter {
    /** @inheritdoc */
    public convert(input: string): string {
        try {
            return base64.fromByteArray(toByteArray(input)).replace(/(.{76})/g, "$1\n");
        } catch (error) {
            return `ENCODING ERROR: ${getErrorMessage(error)}`;
        }
    }
}
