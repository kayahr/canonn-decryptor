/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.js";
import { stringOption } from "./options/StringOption.js";

/**
 * Abstract base class for the one-time pad encoder and decoder.
 */
export abstract class OneTimePadCipher extends Converter {
    /** The pad characters to encode/decode with. */
    @stringOption<OneTimePadCipher>("pad", "Pad", { onChange: converter => converter.resetCaches() })
    public pad!: string;

    /** The cipher direction. 1 for encoding, -1 for decoding */
    protected abstract readonly direction: 1 | -1;

    /** The cached array of valid pad characters converted to numbers (0-25). */
    private cachedPadCodes: number[] | null = null;

    /**
     * Reset the cached pad codes. Internally called when the pad code characters are changed.
     */
    private resetCaches(): void {
        this.cachedPadCodes = null;
    }

    /**
     * Returns the pad codes as an array with numbers 0-25. This is generated from the entered pad characters but
     * only valid characters are used from it. Case doesn't matter.
     *
     * @returns the list of valid pad codes.
     */
    public getPadCodes(): number[] {
        return this.cachedPadCodes ??= this.pad.toUpperCase().replace(/[^A-Z]/g, "").split("").map(char => char.charCodeAt(0) - 65);
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const padCodes = this.getPadCodes();
        const len = padCodes.length;
        let index = 0;
        return input.replace(/[a-z]/gi, char => {
            const source = char.toUpperCase().charCodeAt(0) - 65;
            const padCode = padCodes[index % len] ?? 0;
            const target = (26 + source + padCode * this.direction) % 26;
            index++;
            return String.fromCharCode(target + (char >= "a" ? 97 : 65));
        });
    }
}
