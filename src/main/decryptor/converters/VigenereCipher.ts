/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.js";
import { stringOption } from "./options/StringOption.js";

/**
 * Abstract base class for the Vigenère encoder and decoder.
 */
export abstract class VigenereCipher extends Converter {
    /** The keyword to encode/decode with. */
    @stringOption<VigenereCipher>("keyword", "Keyword", { onChange: cipher => cipher.resetKeys() })
    public keyword!: string;

    private keys: number[] | null = null;

    /**
     * Reset the keys so they are recreated on next access via {@link getKeys}. Called when keyword changes.
     */
    private resetKeys(): void {
        this.keys = null;
    }

    /**
     * Creates the key characters from the configured keyword.
     */
    private getKeys(): number[] {
        return this.keys ??= this.keyword.toUpperCase().split("").filter(c => c >= "A" && c <= "Z").map(c => c.charCodeAt(0) - 65);
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const keys = this.getKeys();
        let index = 0;
        return input.replace(/[a-z]/gi, char => {
            const base = char < "a" ? 65 : 97;
            const key = keys[index] ?? 0;
            index = (index + 1) % keys.length;
            return String.fromCharCode(this.convertChar(char.charCodeAt(0) - base, key) + base);
        });
    }

    /**
     * Converts a single character.
     *
     * @param char  The character to convert (A=0, Z=25).
     * @param key   The corresponding character from the keyword (A=0, Z=25)
     * @return The converted character (0-25).
     */
    protected abstract convertChar(char: number, key: number): number;
}
