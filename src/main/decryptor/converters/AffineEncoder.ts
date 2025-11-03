/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AffineCipher, type aTable, k } from "./AffineCipher.ts";
import { converter } from "./Converter.ts";

/**
 * Affine cipher encoder.
 *
 * @see https://en.wikipedia.org/wiki/Affine_cipher
 */
@converter<AffineEncoder>("affine-encoder", "affine", "Affine Encoder", "Encodes text with the Affine Cipher.")
export class AffineEncoder extends AffineCipher<AffineEncoder> {
    /** @inheritdoc */
    public override convert(input: string): string {
        const a = Number(this.a) as typeof aTable[number];
        const b = Number(this.b);
        return input.replace(/[a-z]/gi, char => {
            const upperChar = char.toUpperCase();
            const x = upperChar.charCodeAt(0) - 65;
            const r = (x * a + b) % k;
            return String.fromCharCode(r + (upperChar === char ? 65 : 97));
        });
    }
}
