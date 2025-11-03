/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { escapeRegExp, unescape } from "../../utils/string.ts";
import { Converter, converter } from "./Converter.ts";
import { stringOption } from "./options/StringOption.ts";

/** Mapping table from morse to cleartext. */
const alphabet: Record<string, string> = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    "-----": "0",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    ".-.-.-": ".",
    "--..--": ",",
    "..--..": "?",
    ".----.": "'",
    "-.-.--": "!",
    "-..-.": "/",
    "-.--.": "(",
    "-.--.-": ")",
    ".-...": "&",
    "---...": ":",
    "-.-.-.": ";",
    "-...-": "=",
    ".-.-.": "+",
    "-....-": "-",
    "..--.-": "_",
    ".-..-.": "\"",
    "...-..-": "$",
    ".--.-.": "@",
    "...-.-": "[end]",
    "........": "[error]",
    "-.-.-": "[start]",
    "...-.": "[understood]",
    ".-.-": "\n",
    "-..---": "[next-japanese]",
    "...---...": "[SOS]"
};

/**
 * Function to decode morse into clear text.
 *
 * @param morse - The morse string. When not a morse string then it is returned as-is.
 * @returns The clear text string.
 */
function decodeMorse(morse: string): string {
    return alphabet[morse] ?? morse;
}

/**
 * Morse decoder.
 */
@converter<MorseDecoder>("morse-decoder", "morse", "Morse Decoder", "Decodes morse code into ASCII characters.")
export class MorseDecoder extends Converter {
    /** Cached regular expression for morse character matching. */
    private morseRegExp: RegExp | null = null;

    /** Cached regular expression for morse character group matching. */
    private groupRegExp: RegExp | null = null;

    /** Cached regular expression for replacing dash characters. */
    private dashesRegExp: RegExp | null = null;

    /** Cached regular expression for replacing dot characters. */
    private dotsRegExp: RegExp | null = null;

    /** Cached regular expression for replacing space characters. */
    private spacesRegExp: RegExp | null = null;

    /** The characters to be used for morse dots. */
    @stringOption<MorseDecoder>("dots", "Dots", { defaultValue: ".·*", onChange: decoder => decoder.resetCaches() })
    public dots!: string;

    /** The characters to be used for morse dashes. */
    @stringOption<MorseDecoder>("dashes", "Dashes", { defaultValue: "_-−", onChange: decoder => decoder.resetCaches() })
    public dashes!: string;

    /** The characters to be used for spaces. */
    @stringOption<MorseDecoder>("spaces", "Spaces", { defaultValue: " \\t", onChange: decoder => decoder.resetCaches() })
    public spaces!: string;

    /**
     * Returns the regular expression range to match morse tokens.
     *
     * @returns The morse tokens regular expression range.
     */
    private getRange(): string {
        return `[${escapeRegExp(this.dots + this.dashes)}]`;
    }

    /**
     * Generates (and caches) the regular expression to replace dot characters.
     *
     * @returns The regular expression to replace dot characters.
     */
    private getDotsRegExp(): RegExp {
        return this.dotsRegExp ??= new RegExp(`[${escapeRegExp(this.dots)}]`, "g");
    }

    /**
     * Generates (and caches) the regular expression to replace dash characters.
     *
     * @returns The regular expression to replace dash characters.
     */
    private getDashesRegExp(): RegExp {
        return this.dashesRegExp ??= new RegExp(`[${escapeRegExp(this.dashes)}]`, "g");
    }

    /**
     * Generates (and caches) the regular expression to replace space characters.
     *
     * @returns The regular expression to replace space characters.
     */
    private getSpacesRegExp(): RegExp {
        return this.spacesRegExp ??= new RegExp(`[${escapeRegExp(unescape(this.spaces))}]`, "g");
    }

    /**
     * Generates (and caches) the regular expression to match a morse character.
     *
     * @returns The regular expression to match a morse character.
     */
    private getMorseRegExp(): RegExp {
        if (this.morseRegExp == null) {
            const range = this.getRange();
            const spaces = `[${escapeRegExp(unescape(this.spaces))}]`;
            this.morseRegExp = new RegExp(`(${spaces}?)(${range}+)`, "g");
        }
        return this.morseRegExp;
    }

    /**
     * Generates (and caches) the regular expression to match a morse character group.
     *
     * @returns The regular expression to match a morse character group.
     */
    private getGroupRegExp(): RegExp {
        if (this.groupRegExp == null) {
            const range = this.getRange();
            const spaces = `[${escapeRegExp(unescape(this.spaces))}]+`;
            this.groupRegExp = new RegExp(`(^|${spaces})(${range}+(?:${spaces}${range}+)*)($|${spaces})`, "gim");
        }
        return this.groupRegExp;
    }

    /**
     * Resets regular expression caches. Called internally when an option has been changed.
     */
    private resetCaches(): void {
        this.dashesRegExp = null;
        this.dotsRegExp = null;
        this.spacesRegExp = null;
        this.groupRegExp = null;
        this.morseRegExp = null;
    }

    /** @inheritdoc */
    public convert(input: string): string {
        const dots = this.getDotsRegExp();
        const dashes = this.getDashesRegExp();
        return input
            .replace(this.getGroupRegExp(), (all, prefix: string, match: string, suffix: string) =>
                prefix + match.replace(this.getMorseRegExp(), (all, space: string, morse: string) =>
                    decodeMorse(morse.replace(dots, ".").replace(dashes, "-"))
                ) + suffix
        ).replaceAll(this.getSpacesRegExp(), s => /\s/.test(s) ? s : " ");
    }
}
