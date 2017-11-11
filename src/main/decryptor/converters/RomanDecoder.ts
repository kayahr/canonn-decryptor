/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter";

/** Mapping table from roman numbers to numeric values. */
const romanNumerals: { [roman: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
};

const range = "(?:M{0,3})(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})";
const romanRegExp = new RegExp(`(${range})`, "ig");
const groupRegExp = new RegExp(`(^|\\s+)(${range}(?:\\s+${range})*)($|\\s+)`, "ig");

/**
 * Decodes a roman number into a numeric value.
 *
 * @param roman  The roman number to decode.
 * @return The numeric value.
 */
function decodeRoman(roman: string): number {
    const result = roman.match(/M|CM|D|CD|C|XC|L|XL|X|IX|V|IV|I/gi);
    return result ? result.reduce((result, match) => result + romanNumerals[match.toUpperCase()], 0) : 0;
}

/**
 * Roman number decoder.
 */
@converter<RomanDecoder>("roman-decoder", "roman", "Roman Decoder", "Decodes roman numerals into decimal numbers.")
export class RomanDecoder extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        return input.replace(groupRegExp, (all, prefix: string, match: string, suffix: string) =>
            prefix + match.replace(romanRegExp, roman => (roman === "" ? "" : "" + decodeRoman(roman))) + suffix
        );
    }
}
