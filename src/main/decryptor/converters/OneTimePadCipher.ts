/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter";
import { stringOption } from "./options/StringOption";

/**
 * Abstract base class for the one-time pad encoder and decoder.
 */
export abstract class OneTimePadCipher extends Converter {
    /** The pad characters to encode/decode with. */
    @stringOption<OneTimePadCipher>("pad", "Pad", { onChange: converter => converter.resetCaches() })
    private pad: string;

    /** The cipher direction. 1 for encoding, -1 for decoding */
    private readonly direction: 1 | -1;

    /** The cached array of valid pad characters converted to numbers (0-25). */
    private cachedPadCodes: number[] | null = null;

    /**
     * Creates a new one-time pad cipher with the given pad characters.
     *
     * @param direction  The cipher direction. 1 for encoding, -1 for decoding.
     * @param pad        Optional initial pad characters to encode/decode with. Defaults to no pad when not specified.
     */
    public constructor(direction: 1 | -1, pad?: string) {
        super();
        this.direction = direction;
        if (pad != null) {
            this.pad = pad;
        }
    }

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
     * @return the list of valid pad codes.
     */
    public getPadCodes(): number[] {
        if (!this.cachedPadCodes) {
            this.cachedPadCodes = this.pad.toUpperCase().replace(/[^A-Z]/g, "").split("")
                .map(char => char.charCodeAt(0) - 65);
        }
        return this.cachedPadCodes;
    }

    /**
     * Returns the pad characters to encode/decode with.
     *
     * @return The pad characters.
     */
    public getPad(): string {
        return this.pad;
    }

    /**
     * Sets the pad characters to encode/decode with.
     *
     * @param pad  The pad characters to set.
     */
    public setPad(pad: string): void {
        this.pad = pad;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const padCodes = this.getPadCodes();
        const len = padCodes.length;
        let index = 0;
        return input.replace(/[a-zA-Z]/g, char => {
            const source = char.toUpperCase().charCodeAt(0) - 65;
            const padCode = padCodes[index % len] || 0;
            const target = (26 + source + padCode * this.direction) % 26;
            index++;
            return String.fromCharCode(target + (char >= "a" ? 97 : 65));
        });
    }
}
