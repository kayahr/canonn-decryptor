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
    /** The sequence to be used for morse dot. */
    @stringOption<MorseEncoder>("dot", "Dot", { defaultValue: ".", allowEmpty: false })
    public dot!: string;

    /** The sequence to be used for morse dash. */
    @stringOption<MorseEncoder>("dash", "Dash", { defaultValue: "-", allowEmpty: false })
    public dash!: string;

    /** The sequence to be used for spacing. */
    @stringOption<MorseEncoder>("space", "Space", { defaultValue: " ", allowEmpty: false })
    public space!: string;

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
                    let index = 0;
                    return text.toUpperCase().replace(characterReplace, c => (index++ > 0 ? " " : "") + alphabet[c])
                        .replace(/[.-]/g, char => char === "." ? this.dot : this.dash);
                } else {
                    return text;
                }
            }).filter(text => text.length > 0).map(text => text.replace(/^(\s*)\s$/, "$1")).join(" ");
        }).join("\n").replaceAll(" ", this.space);
    }
}
