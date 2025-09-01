/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { FastString } from "../../utils/FastString.js";
import { quadgrams } from "../../utils/Quadgrams.js";
import { CaesarCipher } from "./CaesarCipher.js";
import { converter } from "./Converter.js";
import { booleanOption } from "./options/BooleanOption.js";

/**
 * Converter for caesar decoding.
 */
@converter<CaesarDecoder>("caesar-decoder", "caesar", "Caesar Decoder",
    "Decodes text encrypted by simple alphabet rotation.")
export class CaesarDecoder extends CaesarCipher<CaesarDecoder> {
    /** The alphabet rotation. */
    @booleanOption<CaesarDecoder>("auto", "Automatic", { defaultValue: true, sortIndex: -1 })
    public auto!: boolean;

    /** @inheritDoc */
    protected readonly direction = -1;

    /** @inheritDoc */
    public override convert(input: string): string {
        if (this.auto) {
            const scores: Array<{ score: number, rotation: number }> = [];
            for (let rotation = 0; rotation < 26; ++rotation) {
                const score = quadgrams.getScore(FastString.fromString(this.rotateText(input, -rotation)));
                scores.push({ score, rotation });
            }
            scores.sort((a, b) => b.score - a.score);
            this.rotation = scores[0].rotation;
        }
        return super.convert(input);
    }
}
