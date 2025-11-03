/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AffineCipher, aMapping, type aTable, k } from "./AffineCipher.ts";
import { converter } from "./Converter.ts";

/**
 * Affine cipher decoder.
 */
@converter<AffineDecoder>("affine-decoder", "affine", "Affine Decoder", "Decodes text encrypted with the Affine Cipher.")
export class AffineDecoder extends AffineCipher<AffineDecoder> {
    /** @inheritdoc */
    public override convert(input: string): string {
        const a = Number(this.a) as typeof aTable[number];
        const a1 = aMapping[a];
        const b = Number(this.b);
        return input.replace(/[a-z]/gi, char => {
            const upperChar = char.toUpperCase();
            const y = upperChar.charCodeAt(0) - 65;
            let r = (a1 * (y - b)) % k;
            while (r < 0) {
                r += k;
            }
            return String.fromCharCode(r + (upperChar === char ? 65 : 97));
        });
    }
}
