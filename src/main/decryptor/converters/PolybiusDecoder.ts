/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.ts";
import { PolybiusCipher } from "./PolybiusCipher.ts";

/**
 * Polybius square decoder.
 */
@converter<PolybiusDecoder>("polybius-decoder", "polybius", "Polybius Square Decoder", "Decodes polybius square numbers to text.")
export class PolybiusDecoder extends PolybiusCipher<PolybiusDecoder> {
    /** @inheritdoc */
    public override convert(input: string): string {
        const square = this.getSquare();
        return input.replace(/(?<!\\w)\d\d(?: +\d\d)*(?!\\w)/gi, match =>
            match.replace(/\s*(\d)(\d)( *)/g, (match, row, column, spaces: string) =>
                (square[Number(row - 1)]?.[Number(column - 1)] ?? "�") + spaces.substring(1)
            )
        );
    }
}
