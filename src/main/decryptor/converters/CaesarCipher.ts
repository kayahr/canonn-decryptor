/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.js";
import { numberOption } from "./options/NumberOption.js";

/**
 * Abstract base class for the caesar decoder and encoder.
 */
export abstract class CaesarCipher<T> extends Converter<T> {
    /** The alphabet rotation. */
    @numberOption<CaesarCipher<T>>("rotation", "Rotation", {
        max: 25,
        defaultValue: 13,
        disabled: converter => converter.isAutomatic()
    })
    public rotation!: number;

    /** The rotation direction. For the encoder it is 1, for the decoder it is -1. */
    protected abstract direction: number;

    /**
     * Checks if rotation is calculated automatically.
     *
     * @return True if operating in automatic mode, false if not.
     */
    protected isAutomatic(): boolean {
        return false;
    }

    /**
     * Rotates a character.
     *
     * @param char      The character to rotate.
     * @param rotation  How far to rotate the character. Can be positive or negative and is automatically clamped
     *                  into the valid range of 26 characters.
     * @param base      The base character number. Usually 97 for lowercase 'a' or 65 for uppercase 'A'.
     * @return The rotated character.
     */
    protected rotate(char: string, rotation: number, base: number): string {
        return String.fromCharCode(((((char.charCodeAt(0) - base) + rotation) % 26) + 26) % 26 + base);
    }

    /**
     * Converts a single char.
     *
     * @param char      The character to convert.
     * @param rotation  Optional alphabet rotation
     */
    protected convertChar(char: string, rotation = 13): string {
        if (char >= "a" && char <= "z") {
            return this.rotate(char, rotation, 97);
        } else if (char >= "A" && char <= "Z") {
            return this.rotate(char, rotation, 65);
        } else return char;
    }

    /**
     * Rotates the given text with the given rotation.
     *
     * @param text      The text to rotate.
     * @param rotation  How far to rate the characters.
     * @return The rotated text.
     */
    protected rotateText(text: string, rotation: number): string {
        return text.split("").map(char => this.convertChar(char, rotation)).join("");
    }

    /** @inheritDoc */
    public convert(input: string): string {
        return this.rotateText(input, this.rotation * this.direction);
    }
}
