/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter";
import { stringOption } from "./options/StringOption";

/**
 * Abstract base class for the Vigènere encoder and decoder.
 */
export abstract class VigenereCipher extends Converter {
    /** The keyword to encode/decode with. */
    @stringOption("keyword", "Keyword", { onChange: (cipher: VigenereCipher) => cipher.createKeys() })
    protected keyword: string;

    /** Key characters created from the configured keyword. */
    private keys: number[] = [];

    /**
     * Creates a new Vigènere cipher with the given keyword.
     *
     * @param keyword  Optional initial keyword. Defaults to no keyword when not specified.
     */
    public constructor(keyword?: string) {
        super();
        if (keyword != null) {
            this.keyword = keyword;
        }
    }

    /**
     * Creates the key characters from the configured keyword.
     */
    private createKeys() {
        this.keys = this.keyword.toUpperCase().split("").filter(c => c >= "A" && c <= "Z")
            .map(c => c.charCodeAt(0) - 65);
    }

    /**
     * Returns the keyword.
     *
     * @return The keyword.
     */
    public getKeyword(): string {
        return this.keyword;
    }

    /**
     * Sets the keyword.
     *
     * @param keyword  The keyword to set.
     */
    public setKeyword(keyword: string): void {
        this.keyword = keyword;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const keys = this.keys;
        let index = 0;
        return input.replace(/[a-z]/ig, char => {
            const base = char < "a" ? 65 : 97;
            const key = keys[index] || 0;
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
