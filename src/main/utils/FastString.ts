/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de
 * See LICENSE.md for licensing information.
 */

/** Regular expression to match upper-case words in a string. */
import { Alphabet } from "./Alphabet";
import { isEqual, Equatable } from "./Equatable";

const WORD_REGEXP = /\b[A-Z]+\b/gi;

export class FastString extends Array<number> implements Equatable {
    public constructor() {
        super();
        Object.setPrototypeOf(this, FastString.prototype);
    }

    public static fromString(s: string): FastString {
        const result = new FastString();
        const words = s.match(WORD_REGEXP);
        if (words) {
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

    public toString(): string {
        return this.map(c => String.fromCharCode(c ? (c + 64) : 32)).join("").trim();
    }

    public substitute(alphabet: Alphabet, dest: FastString = this): FastString {
        for (let i = 0, len = this.length; i !== len; ++i) {
            dest[i] = alphabet[this[i]];
        }
        return dest;
    }

    /** @inheritDoc */
    public equals(other: any): boolean {
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
