/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter.js";

/** Table with decimal values and their roman numeral counter-part. */
const conversions = [
    { decimal: 1000, roman: "M" },
    { decimal: 900, roman: "CM" },
    { decimal: 500, roman: "D" },
    { decimal: 400, roman: "CD" },
    { decimal: 100, roman: "C" },
    { decimal: 90, roman: "XC" },
    { decimal: 50, roman: "L" },
    { decimal: 40, roman: "XL" },
    { decimal: 10, roman: "X" },
    { decimal: 9, roman: "IX" },
    { decimal: 5, roman: "V" },
    { decimal: 4, roman: "IV" },
    { decimal: 1, roman: "I" }
];

const range = "[0-9]+";
// eslint-disable-next-line regexp/no-unused-capturing-group, regexp/prefer-d
const decimalRegExp = new RegExp(`(${range})`, "g");
// eslint-disable-next-line regexp/prefer-d
const groupRegExp = new RegExp(`(^|\\s+)(${range}(?:\\s+${range})*)($|\\s+)`, "g");

/**
 * Encodes a decimal number into a roman numeral.
 *
 * @param decimal  The decimal number to encode.
 * @return The roman numeral.
 */
function encodeRoman(decimal: number): string {
    // Roman numbers can't be lower than 1 or larger than 3999
    if (decimal < 1 || decimal > 3999) {
        return "" + decimal;
    }

    let roman = "";
    while (decimal > 0) {
        for (const conversion of conversions) {
            if (decimal >= conversion.decimal) {
                roman += conversion.roman;
                decimal -= conversion.decimal;
                break;
            }
        }
    }
    return roman;
}

/**
 * Roman number encoder.
 */
@converter<RomanEncoder>("roman-encoder", "roman", "Roman Encoder", "Encodes decimal numbers into roman numerals.")
export class RomanEncoder extends Converter {
    /** @inheritDoc */
    public convert(input: string): string {
        return input.replace(groupRegExp, (all, prefix: string, match: string, suffix: string) =>
            prefix + match.replace(decimalRegExp, decimal => encodeRoman(+decimal)) + suffix
        );
    }
}
