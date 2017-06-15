/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter";
import { numberOption } from "./options/NumberOption";

/**
 * Abstract base class for the caesar decoder and encoder.
 */
export abstract class CaesarCipher extends Converter {
    /** The alphabet rotation. */
    @numberOption("rotation", "Rotation", { max: 26, defaultValue: 13 })
    protected rotation: number;

    /** The rotation direction. For the encoder it is 1, for the decoder it is -1. */
    protected abstract direction: number;

    /**
     * Creates a new caesar converter.
     *
     * @param rotation  Optional initial alphabet rotation. Defaults to 13.
     */
    public constructor(rotation?: number) {
        super();
        if (rotation != null) {
            this.rotation = rotation;
        }
    }

    /**
     * Returns the current alphabet rotation.
     */
    public getRotation(): number {
        return this.rotation;
    }

    /**
     * Sets the alphabet rotation.
     *
     * @param rotation  The alphabet rotation to set.
     */
    public setRotation(rotation: number): void {
        this.rotation = rotation;
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

    /** @inheritDoc */
    public convert(input: string): string {
        const rotation = this.rotation * this.direction;
        return input.split("").map(char => this.convertChar(char, rotation)).join("");
    }
}
