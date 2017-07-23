/** Regular expression to match upper-case words in a string. */
import { Alphabet } from "./Alphabet";

const WORD_REGEXP = /\b[A-Z]+\b/gi;

export class FastString extends Array<number> {
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
}
