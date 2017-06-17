/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter";
import { stringOption } from "./options/StringOption";

/** The standard alphabet. */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Abstract base class for the keyword encoder and decoder.
 */
export abstract class KeywordCipher extends Converter {
    /** The keyword to encode/decode with. */
    @stringOption("keyword", "Keyword", { onChange: (converter: KeywordCipher) => converter.resetCaches() })
    protected keyword: string;

    /** The alphabet generated for the configured keyword. */
    protected alphabet: string | null = null;

    /**
     * Creates a new keyword cipher with the given keyword.
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
     * Returns the alphabet generated for the configured keyword. The alphabet is cached so it is only generated
     * once after a keyword change.
     *
     * @return The generated alphabet.
     */
    public getAlphabet(): string {
        if (this.alphabet == null) {
            this.alphabet = this.keyword
                .toUpperCase().split("")
                .filter(char => char >= "A" && char <= "Z")
                .concat(ALPHABET)
                .filter((char, index, alphabet) => !(alphabet.indexOf(char) < index))
                .join("");
        }
        return this.alphabet;
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

    /**
     * Reset the cached alphabet. Internally called when the keyword is changed.
     */
    private resetCaches(): void {
        this.alphabet = null;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        return input.split("").map(char => {
            if (char >= "A" && char <= "Z") {
                return this.convertChar(char);
            } else if (char >= "a" && char <= "z") {
                return this.convertChar(char.toUpperCase()).toLowerCase();
            } else {
                return char;
            }
        }).join("");
    }

    /**
     * Converts a single character.
     *
     * @param char  The character to convert.
     * @return The converted character.
     */
    protected abstract convertChar(char: string): string;
}
