/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.ts";
import { KeywordCipher } from "./KeywordCipher.ts";

/**
 * Keyword encoder.
 */
@converter<KeywordEncoder>("keyword-encoder", "keyword", "Keyword Encoder", "Encodes text with keyword based alphabet substitution.")
export class KeywordEncoder extends KeywordCipher {
    /** @inheritdoc */
    protected convertChar(char: string): string {
        return this.getAlphabet()[char.charCodeAt(0) - 65];
    }
}
