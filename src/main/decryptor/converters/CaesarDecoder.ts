/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CaesarCipher } from "./CaesarCipher";
import { converter } from "./Converter";
import { booleanOption } from "./options/BooleanOption";
import { quadgrams } from "../../utils/Quadgrams";
import { FastString } from "../../utils/FastString";

/**
 * Converter for caesar decoding.
 */
@converter("caesar-decoder", "caesar", "Caesar Decoder", "Decodes text encrypted by simple alphabet rotation.")
export class CaesarDecoder extends CaesarCipher {
    /** The alphabet rotation. */
    @booleanOption("auto", "Automatic", { defaultValue: true, sortIndex: -1 })
    protected automatic: boolean;

    /** @inheritDoc */
    protected readonly direction = -1;

    /**
     * Creates a new caesar converter.
     *
     * @param automatic  Optional automatic flag. Defaults to true.
     * @param rotation   Optional initial alphabet rotation. Defaults to 13. Only makes sense when not running in auto
     *                   mode.
     */
    public constructor(automatic?: boolean, rotation?: number) {
        super(rotation);
        if (automatic != null) {
            this.automatic = automatic;
        }
    }

    /** @inheritDoc */
    protected isAutomatic(): boolean {
        return this.automatic;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        if (this.automatic) {
            let scores: { score: number, rotation: number }[] = [];
            for (let rotation = 0; rotation < 26; ++rotation) {
                const score = quadgrams.getScore(FastString.fromString(this.rotateText(input, -rotation)));
                scores.push({ score, rotation });
            }
            scores.sort((a, b) => b.score - a.score);
            this.setRotation(scores[0].rotation);
        }
        return super.convert(input);
    }
}
