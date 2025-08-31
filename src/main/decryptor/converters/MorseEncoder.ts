/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { escapeRegExp } from "../../utils/string.js";
import { converter } from "./Converter.js";
import { Converter } from "./Converter.js";
import { stringOption } from "./options/StringOption.js";

/** Mapping table from cleartext to morse. */
const alphabet: { [ key: string ]: string } = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    "\"": ".-..-.",
    $: "...-..-",
    "@": ".--.-."
};

/** Range string containing all ASCII characters with morse equivalent. */
const range = "[" + Object.keys(alphabet).map(escapeRegExp).join("") + "]";

/** Regular expression used to replace a single ASCII character with morse. */
const characterReplace = new RegExp(range, "gi");

/** Regular expression used to replace a group of ASCII characters with morse equivalent. */
const groupReplace = new RegExp("(" + range + "+)", "gi");

/**
 * Morse encoder.
 */
@converter<MorseEncoder>("morse-encoder", "morse", "Morse Encoder", "Encodes ASCII characters to morse code.")
export class MorseEncoder extends Converter {
    /** The character to be used for morse dot. */
    @stringOption<MorseEncoder>("dot", "Dot", { defaultValue: ".", allowEmpty: false, maxLength: 1 })
    private dot: string = ".";

    /** The character to be used for morse dash. */
    @stringOption<MorseEncoder>("dash", "Dash", { defaultValue: "-", allowEmpty: false, maxLength: 1 })
    private dash: string = "-";

    /**
     * Creates a new morse decoder.
     *
     * @param dot   Optional morse dot character. Defaults to ".".
     * @param dash  Optional morse dash character. Defaults to "-".
     */
    public constructor(dot?: string, dash?: string) {
        super();
        if (dot != null) {
            this.dot = dot;
        }
        if (dash != null) {
            this.dash = dash;
        }
    }

    /**
     * Returns the character to be used for morse dots.
     *
     * @return The morse dot character.
     */
    public getDot(): string {
        return this.dot;
    }

    /**
     * Sets the character to be used for morse dots.
     *
     * @param dot  The morse dot character to set.
     */
    public setDot(dot: string): void {
        this.dot = dot;
    }

    /**
     * Returns the character to be used for morse dashes.
     *
     * @return The morse dash character.
     */
    public getDash(): string {
        return this.dash;
    }

    /**
     * Sets the character to be used for morse dashes.
     *
     * @param dash  The morse dash character.
     */
    public setDash(dash: string): void {
        this.dash = dash;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        const lines = input.split(/\n/);
        return lines.map(line => {
            // Split line into parts divided by character groups which can be translate to morse
            const parts = line.split(groupReplace);

            // If there is only one part then it can't be translatable and we also don't have to mess with
            // white-spacing so return the line unchanged
            if (parts.length === 1) {
                return line;
            }

            return parts.map((text, index) => {
                if ((index & 1) !== 0) {
                    return text.toUpperCase().replace(characterReplace, c => alphabet[c] + " ").trim()
                        .replace(/[.-]/g, char => char === "." ? this.dot : this.dash);
                } else {
                    return text;
                }
            }).filter(text => text.length > 0).map(text => text.replace(/^(\s*)\s$/, "$1")).join(" ");
        }).join("\n");
    }
}
