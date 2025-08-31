/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.js";
import { KeywordCipher } from "./KeywordCipher.js";

/**
 * Keyword encoder.
 */
@converter<KeywordEncoder>("keyword-encoder", "keyword", "Keyword Encoder",
    "Encodes text by encrypting it with keyword based alphabet substitution.")
export class KeywordEncoder extends KeywordCipher {
    /** @inheritDoc */
    protected convertChar(char: string): string {
        return this.getAlphabet()[char.charCodeAt(0) - 65];
    }
}
