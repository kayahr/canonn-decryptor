/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** English alphabet letter frequency (https://en.wikipedia.org/wiki/Letter_frequency) */
const letterFrequency = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929,
    0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074
];

/** English alphabet letter frequency for first letters in words (https://en.wikipedia.org/wiki/Letter_frequency) */
const firstLetterFrequency = [
    11.602, 4.702, 3.511, 2.670, 2.007, 3.779, 1.950, 7.232, 6.286, 0.597, 0.590, 2.705, 4.383, 2.365, 6.264, 2.545,
    0.173, 1.653, 7.755, 16.671, 1.487, 0.649, 6.753, 0.017, 1.620, 0.034
];

/**
 * Escapes a string so it can be safely used within a regular expression.
 *
 * @param s  The string to escape.
 * @return The escaped string.
 */
export function escapeRegExp(s: string): string {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * Returns the score of the given text. The score is calculated by checking the english alphabet letter frequencies.
 * A higher score means a higher possibility that the given text is an english plain text.
 *
 * @param text  The text to check.
 * @return The text score.
 */
export function textScore(text: string): number {
    const matches = text.match(/([a-z]+)/gi);
    let score = 0;
    if (matches) {
        for (const match of matches) {
            const chars = match.toUpperCase().split("").map(c => c.charCodeAt(0) - 65);
            let first = true;
            for (const char of chars) {
                score += first ? firstLetterFrequency[char] : letterFrequency[char];
                first = false;
            }
        }
    }
    return score;
}
