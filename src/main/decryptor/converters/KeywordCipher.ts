/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.ts";
import { stringOption } from "./options/StringOption.ts";

/** The standard alphabet. */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Abstract base class for the keyword encoder and decoder.
 */
export abstract class KeywordCipher extends Converter {
    /** The keyword to encode/decode with. */
    @stringOption<KeywordCipher>("keyword", "Keyword", { onChange: converter => converter.resetCaches() })
    public keyword!: string;

    /** The alphabet generated for the configured keyword. */
    protected alphabet: string | null = null;

    /**
     * Returns the alphabet generated for the configured keyword. The alphabet is cached so it is only generated
     * once after a keyword change.
     *
     * @returns The generated alphabet.
     */
    public getAlphabet(): string {
        this.alphabet ??= this.keyword
            .toUpperCase().split("")
            .filter(char => char >= "A" && char <= "Z")
            .concat(ALPHABET)
            .filter((char, index, alphabet) => !(alphabet.indexOf(char) < index))
            .join("");
        return this.alphabet;
    }

    /**
     * Reset the cached alphabet. Internally called when the keyword is changed.
     */
    private resetCaches(): void {
        this.alphabet = null;
    }

    /** @inheritdoc */
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
     * @param char - The character to convert.
     * @returns The converted character.
     */
    protected abstract convertChar(char: string): string;
}
