/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.ts";
import { selectOption } from "./options/SelectOption.ts";

/** Latin alphabet has 26 characters. */
export const k = 26;

/** Allowed 'a' values for the latin 26 letters alphabet. */
export const aTable = [ 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25 ] as const;
export const aMapping = {
    1: 1,
    3: 9,
    5: 21,
    7: 15,
    9: 3,
    11: 19,
    15: 7,
    17: 23,
    19: 11,
    21: 5,
    23: 17,
    25: 25
} as const;

/**
 * Base class for Affine cipher decoder and encoder.
 *
 * @see https://en.wikipedia.org/wiki/Affine_cipher
 */
export abstract class AffineCipher<T extends AffineCipher<T>> extends Converter<T> {
    /** The number base. */
    @selectOption<T>("a", "a", aTable.map(a => ({ label: String(a), value: String(a) })), { defaultValue: "1" })
    public a!: string;

    /** The number base. */
    @selectOption<T>("b", "b", [ ...Array.from({ length: 26 }).keys() ].map(b => ({ label: String(b + 1), value: String(b + 1) })), { defaultValue: "1" })
    public b!: string;

    /** @inheritdoc */
    public abstract override convert(input: string): string;
}
