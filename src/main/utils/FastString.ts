/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Alphabet } from "./Alphabet.js";
import { type Equatable, isEqual } from "./Equatable.js";

/** Regular expression to match upper-case words in a string. */
const WORD_REGEXP = /\b[A-Z]+\b/gi;

/**
 * A special string implementation used for fast quadgram score calculation. It only stores case-insensitive words where the letters are represented by
 * the numbers 1 to 26 and the 0 represents a word separator. The fast string also always begins and ends with 0 so quadgram score calculation sees that
 * as a word boundary.
 */
export class FastString extends Array<number> implements Equatable {
    public constructor() {
        super();
        Object.setPrototypeOf(this, FastString.prototype);
    }

    /**
     * Creates a fast string from the given text.
     *
     * @param s - The text to convert.
     * @returns The text as a fast string object.
     */
    public static fromString(s: string): FastString {
        const result = new FastString();
        const words = s.match(WORD_REGEXP);
        if (words != null) {
            for (const word of words) {
                result.push(0);
                for (const char of word) {
                    const code = (char.charCodeAt(0) - 64) & 31;
                    if (code >= 0 && code < 27) {
                        result.push(code);
                    }
                }
            }
            result.push(0);
        }
        return result;
    }

    /**
     * Converts the fast string back into an upper-case string.
     *
     * @returns The fast string content as a trimmed upper-case string.
     */
    public override toString(): string {
        return this.map(c => String.fromCharCode(c != 0 ? (c + 64) : 32)).join("").trim();
    }

    /**
     * Substitutes the characters of this fast string with the given alphabet and writes the result into the given fast string.
     *
     * @param alphabet - The speed optimized alphabet.
     * @param dest     - The destination fast string to write the substitution result to. If not specified then the current fast string is overwritten.
     * @returns The destination fast string (if specified) or the current fast string.
     */
    public substitute(alphabet: Alphabet, dest: FastString = this): FastString {
        for (let i = 0, len = this.length; i !== len; ++i) {
            dest[i] = alphabet[this[i]];
        }
        return dest;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => {
            const len = this.length;
            if (len !== other.length) {
                return false;
            }
            for (let i = 0; i < len; ++i) {
                if (this[i] !== other[i]) {
                    return false;
                }
            }
            return true;
        });
    }
}
