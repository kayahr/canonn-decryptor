/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.js";
import { KeywordCipher } from "./KeywordCipher.js";

/**
 * Keyword decoder.
 */
@converter<KeywordDecoder>("keyword-decoder", "keyword", "Keyword Decoder",
    "Decodes text encrypted with keyword based alphabet substitution.")
export class KeywordDecoder extends KeywordCipher {
    /** @inheritDoc */
    protected convertChar(char: string): string {
        return String.fromCharCode(65 + this.getAlphabet().indexOf(char));
    }
}
