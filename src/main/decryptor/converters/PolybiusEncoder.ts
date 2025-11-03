/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter.ts";
import { PolybiusCipher } from "./PolybiusCipher.ts";

/**
 * Polybius square encoder.
 */
@converter<PolybiusEncoder>("polybius-encoder", "polybius", "Polybius Square Encoder", "Encodes text to polybius square numbers.")
export class PolybiusEncoder extends PolybiusCipher<PolybiusEncoder> {
    /** @inheritdoc */
    public override convert(input: string): string {
        const separator = " ";
        const square = this.getSquare();
        let result = input.replace(/./g, match => {
            const char = match.toLocaleUpperCase();
            const rowIndex = square.findIndex(row => row.includes(char));
            if (rowIndex === -1) {
                return match;
            }
            const columnIndex = square[rowIndex].indexOf(char);
            if (columnIndex === -1) {
                return match;
            }
            return `${rowIndex + 1}${columnIndex + 1}${separator}`;
        });

        if (separator.length > 0 && result.endsWith(separator)) {
            result = result.substring(0, result.length - separator.length);
        }

        return result;
    }
}
