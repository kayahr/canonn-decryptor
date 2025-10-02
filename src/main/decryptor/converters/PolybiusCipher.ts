/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter } from "./Converter.js";
import { numberOption } from "./options/NumberOption.js";
import { stringOption } from "./options/StringOption.js";

const defaultAlphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

/**
 * Base class for Polybius Square decoder and encoder.
 *
 * @see https://en.wikipedia.org/wiki/Polybius_square
 */
export abstract class PolybiusCipher<T extends PolybiusCipher<T>> extends Converter<T> {
    /** Cached square. */
    private square: string[][] | null = null;

    /** The alphabet. */
    @stringOption<T>("alphabet", "Alphabet", { defaultValue: defaultAlphabet, onChange: converter => converter.resetCache() })
    public alphabet!: string;

    /** The number of rows. */
    @numberOption<T>("rows", "Rows", { min: 1, max: 9, defaultValue: 5, onChange: converter => converter.resetCache() })
    public rows!: number;

    /** The number of columns. */
    @numberOption<T>("columns", "Columns", { min: 1, max: 9, defaultValue: 5, onChange: converter => converter.resetCache() })
    public columns!: number;

    /** @inheritDoc */
    public abstract override convert(input: string): string;

    private resetCache(): void {
        this.square = null;
    }

    public getSquare(): string[][] {
        if (this.square == null) {
            const alphabet = this.alphabet;
            const square: string[][] = this.square = [];
            for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                const row: string[] = [];
                square.push(row);
                for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                    row.push(alphabet.at(rowIndex * this.columns + columnIndex)?.toLocaleUpperCase() ?? "�");
                }
            }
        }
        return this.square;
    }
}
