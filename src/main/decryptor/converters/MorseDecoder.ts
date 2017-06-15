/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { converter } from "./Converter";
import { stringOption } from "./options/StringOption";
import { escapeRegExp } from "../../utils/string";
import { Converter } from "./Converter";

/** Regular expression for white space correction. */
const whiteSpaceCorrection = / (\s*)/g;

/** Mapping table from morse to cleartext. */
const alphabet: { [ key: string ]: string } = {
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
 * @param morse  The morse string. When not a morse string then it is returned as-is.
 * @return The clear text string.
 */
function decodeMorse(morse: string): string {
    return alphabet[morse] || morse;
}

/**
 * Morse decoder.
 */
@converter("morse-decoder", "morse", "Morse Decoder", "Decodes morse code into ASCII characters.")
export class MorseDecoder extends Converter {
    /** Cached regular expression for morse character matching. */
    private morseRegExp: RegExp | null = null;

    /** Cached regular expression for morse character group matching. */
    private groupRegExp: RegExp | null = null;

    /** Cached regular expression for replacing dash characters. */
    private dashesRegExp: RegExp | null = null;

    /** Cached regular expression for replacing dot characters. */
    private dotsRegExp: RegExp | null = null;

    /** The characters to be used for morse dots. */
    @stringOption("dots", "Dots", { defaultValue: ".·*", onChange: MorseDecoder.prototype.resetCaches })
    private dots: string;

    /** The characters to be used for morse dashes. */
    @stringOption("dashes", "Dashes", { defaultValue: "_-−", onChange: MorseDecoder.prototype.resetCaches })
    private dashes: string;

    /**
     * Creates a new morse decoder.
     *
     * @param dots  Optional initial characters to be used for morse dots. A good default is used if not specified.
     * @param dots  Optional initial characters to be used for morse dashes. A good default is used if not specified.
     */
    public constructor(dots?: string, dashes?: string) {
        super();
        if (dots != null) {
            this.dots = dots;
        }
        if (dashes != null) {
            this.dashes = dashes;
        }
    }

    /**
     * Returns the characters to be used for morse dots.
     *
     * @return The morse dot characters.
     */
    public getDots(): string {
        return this.dots;
    }

    /**
     * Sets the characters to be used for morse dots.
     *
     * @param dashes  The morse dot characters.
     */
    public setDots(dots: string): void {
        this.dots = dots;
    }

    /**
     * Returns the characters to be used for morse dashes.
     *
     * @return The morse dash characters.
     */
    public getDashes(): string {
        return this.dashes;
    }

    /**
     * Sets the characters to be used for morse dashes.
     *
     * @param dashes  The morse dash characters.
     */
    public setDashes(dashes: string): void {
        this.dashes = dashes;
    }

    /**
     * Returns the regular expression range to match morse tokens.
     *
     * @return The morse tokens regular expression range.
     */
    private getRange(): string {
        return "[" + escapeRegExp(this.dots + this.dashes) + "]";
    }

    /**
     * Generates (and caches) the regular expression to replace dot characters.
     *
     * @return The regular expression to replace dot characters.
     */
    private getDotsRegExp(): RegExp {
        if (!this.dotsRegExp) {
            this.dotsRegExp = new RegExp(`[${escapeRegExp(this.dots)}]`, "g");
        }
        return this.dotsRegExp;
    }

    /**
     * Generates (and caches) the regular expression to replace dash characters.
     *
     * @return The regular expression to replace dash characters.
     */
    private getDashesRegExp(): RegExp {
        if (!this.dashesRegExp) {
            this.dashesRegExp = new RegExp(`[${escapeRegExp(this.dashes)}]`, "g");
        }
        return this.dashesRegExp;
    }

    /**
     * Generates (and caches) the regular expression to match a morse character.
     *
     * @return The regular expression to match a morse character.
     */
    private getMorseRegExp(): RegExp {
        if (!this.morseRegExp) {
            const range = this.getRange();
            this.morseRegExp = new RegExp(`(${range}+)`, "g");
        }
        return this.morseRegExp;
    }

    /**
     * Generates (and caches) the regular expression to match a morse character group.
     *
     * @return The regular expression to match a morse character group.
     */
    private getGroupRegExp(): RegExp {
        if (!this.groupRegExp) {
            const range = this.getRange();
            this.groupRegExp = new RegExp(`(^|\\s+)(${range}+(?:\\s+${range}+)*)($|\\s+)`, "ig");
        }
        return this.groupRegExp;
    }

    /**
     * Resets regular expression caches. Called internally when an option has been changed.
     */
    private resetCaches(): void {
        this.dashesRegExp = null;
        this.dotsRegExp = null;
        this.groupRegExp = null;
        this.morseRegExp = null;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const dots = this.getDotsRegExp();
        const dashes = this.getDashesRegExp();
        return input.replace(this.getGroupRegExp(), (all, prefix, match, suffix) =>
            prefix + match.replace(dots, ".").replace(dashes, "-").replace(this.getMorseRegExp(), decodeMorse)
                .replace(whiteSpaceCorrection, "$1") + suffix
        );
    }
}
