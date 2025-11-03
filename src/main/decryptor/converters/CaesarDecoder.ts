/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { FastString } from "../../utils/FastString.ts";
import { quadgrams } from "../../utils/Quadgrams.ts";
import { CaesarCipher } from "./CaesarCipher.ts";
import { converter } from "./Converter.ts";
import { booleanOption } from "./options/BooleanOption.ts";

/**
 * Converter for caesar decoding.
 */
@converter<CaesarDecoder>("caesar-decoder", "caesar", "Caesar Decoder",
    "Decodes text encrypted by simple alphabet rotation.")
export class CaesarDecoder extends CaesarCipher<CaesarDecoder> {
    /** The alphabet rotation. */
    @booleanOption<CaesarDecoder>("auto", "Automatic", { defaultValue: true, sortIndex: -1 })
    public auto!: boolean;

    /** @inheritdoc */
    protected readonly direction = -1;

    /** @inheritdoc */
    protected override isAutomatic(): boolean {
        return this.auto;
    }

    /** @inheritdoc */
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
