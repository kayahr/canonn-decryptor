/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de
 * See LICENSE.md for licensing information.
 */

 /**
  * Speed optimized alphabet. Actually it is just a number array with 27 entries. The first entry is always 0 and
  * is used to translate white-space (Which is also defined as 0). The other 26 entries are the letters where A is 1
  * and Z is 26.
  *
  * Please note that this class does not perform any error checking or validation because of its speed optimization.
  * Don't call any of the standard array methods like push/pop because this corrupts the data.
  */
export class Alphabet extends Array<number> {
    /**
     * Constructs a new alphabet initialized to the normal alphabet.
     */
    public constructor() {
        super(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26);
        Object.setPrototypeOf(this, Alphabet.prototype);
    }

    /**
     * Creates a new alphabet initialized by the given keyword.
     *
     * @param keyword  The keyword to initialize the alphabet with.
     * @return The created alphabet.
     */
    public static fromKeyword(keyword: string): Alphabet {
        const alphabet = new Alphabet();
        let insert = 1;
        for (let i = 0, len = keyword.length; i !== len; ++i) {
            const letter = (keyword.charCodeAt(i) - 64 & 31);
            if (letter > 0 && letter < 27) {
                const oldIndex = alphabet.indexOf(letter, insert);
                if (oldIndex > 0) {
                    alphabet.splice(oldIndex, 1);
                    alphabet.splice(insert, 0, letter);
                    ++insert;
                }
            }
        }
        return alphabet;
    }

    /**
     * Creates a new randomized alphabet.
     *
     * @return The randomized alphabet.
     */
    public static createRandom(): Alphabet {
        return new Alphabet().shuffle();
    }

    /**
     * Swaps the letters of the given indices.
     *
     * @param a  The first letter index (1-26).
     * @param b  The second letter index (1-26).
     * @return This alphabet for method chaining.
     */
    public swap(a: number, b: number): Alphabet {
        const tmp = this[a];
        this[a] = this[b];
        this[b] = tmp;
        return this;
    }

    /**
     * Clones the alphabet.
     *
     * @param dest  Optional destination alphabet. If specified then alphabet is cloned into the specified alphabet.
     *              If not specified then a new alphabet is created and returned.
     * @return The cloned alphabet.
     */
    public clone(dest: Alphabet = new Alphabet()): Alphabet {
        for (let i = 1; i < 27; ++i) {
            dest[i] = this[i];
        }
        return dest;
    }

    /**
     * Shuffles this alphabet.
     *
     * @return This alphabet for method chaining.
     */
    public shuffle(): this {
        for (let i = 1; i !== 27; ++i) {
            this.swap(i, Math.floor(Math.random() * 26) + 1);
        }
        return this;
    }

    /**
     * Inverts this alphabet.
     *
     * @return This alphabet for method chaining.
     */
    public invert(): this {
        const old = this.slice();
        for (let i = 1; i !== 27; ++i) {
            this[old[i]] = i;
        }
        return this;
    }

    /**
     * Converts the alphabet into a string and returns it.
     *
     * @return The string representation of the alphabet.
     */
    public toString(): string {
        return this.map(c => String.fromCharCode(c + 64)).join("").substr(1);
    }
}
