/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import quadgramsJSON from "../../../assets/fitness/ngrams.json" with { type: "json" };
import type { FastString } from "../utils/FastString.ts";

export class Quadgrams {
    private readonly scores: Map<string, number>;

    private readonly quadgrams: number[][][][] = [];

    public constructor(raw: Record<string, number>) {
        this.scores = new Map();
        const ngrams = Object.keys(raw);
        const total = ngrams.reduce((total, ngram) => total + raw[ngram], 0);
        const floor = Math.abs(Math.log10(0.01 / total));
        for (const ngram of ngrams) {
            const score = floor - Math.abs(Math.log10(raw[ngram] / total));
            this.scores.set(ngram, score);

            const ngram2 = Array.prototype.map.call(ngram, (char: string) => Math.max(0, char.charCodeAt(0) - 64)) as number[];

            let char = ngram2[0];
            const a = this.quadgrams[char] ?? (this.quadgrams[char] = []);
            char = ngram2[1];
            const b = a[char] ?? (a[char] = []);
            char = ngram2[2];
            const c = b[char] ?? (b[char] = []);
            c[ngram2[3]] = score;
        }
    }

    /**
     * Calculate the englishness score for the given string.
     *
     * @param text - The string (as a {@link FastString} to check.
     * @returns The calculated englishness score.
     */
    public getScore(text: FastString): number {
        let score = 0;
        const root = this.quadgrams;
        for (let i = 0, max = text.length - 3; i < max; ++i) {
            let j = i;
            const a = root[text[j]];
            if (a == null) {
                continue;
            }
            const b = a[text[++j]];
            if (b == null) {
                continue;
            }
            const c = b[text[++j]];
            if (c == null) {
                continue;
            }
            const d = c[text[++j]];
            if (d != null) {
                score += d;
            }
        }
        return score;
    }

    /**
     * Returns the word split with the best score.
     *
     * @param text  - The text to split
     * @param words - Into how many words the text must be splitted
     * @returns The best split as a string together with the achieved score.
     */
    public getBestSplit(text: FastString, words: number): { bestSplit: string, score: number } {
        // Count letters and abort if string is empty
        const totalLetters = text.length;
        if (totalLetters === 0) {
            return { score: 0, bestSplit: "" };
        }

        // Sanitize number of words
        words = Math.min(text.length, Math.max(1, Math.trunc(words)));

        const current = Array.from<number>({ length: words });
        const root = this.quadgrams;
        let bestScore = Number.NEGATIVE_INFINITY;
        let bestPattern: number[] | null = null;

        const evaluateCurrent = (): number => {
            let score = 0;
            let letterIndex = 0;
            let count = 0;
            let w0 = 0;
            let w1 = 0;
            let w2 = 0;
            let w3 = 0;

            const addQuad = (a: number, b: number, c: number, d: number): void => {
                const aNode = root[a];
                if (aNode == null) {
                    return;
                }
                const bNode = aNode[b];
                if (bNode == null) {
                    return;
                }
                const cNode = bNode[c];
                if (cNode == null) {
                    return;
                }
                const dNode = cNode[d];
                if (dNode != null) {
                    score += dNode;
                }
            };

            const push = (value: number): void => {
                switch (count) {
                    case 0:
                        w0 = value;
                        count = 1;
                        return;
                    case 1:
                        w1 = value;
                        count = 2;
                        return;
                    case 2:
                        w2 = value;
                        count = 3;
                        return;
                    case 3:
                        w3 = value;
                        count = 4;
                        addQuad(w0, w1, w2, w3);
                        return;
                    default:
                        w0 = w1;
                        w1 = w2;
                        w2 = w3;
                        w3 = value;
                        addQuad(w0, w1, w2, w3);
                }
            };

            for (let segmentIndex = 0; segmentIndex < words; segmentIndex++) {
                push(0);
                const segmentLength = current[segmentIndex];
                for (let i = 0; i < segmentLength; i++) {
                    push(text[letterIndex++]);
                }
            }

            push(0);

            return score;
        };

        const explore = (depth: number, lettersRemaining: number, wordsRemaining: number): void => {
            if (wordsRemaining === 1) {
                current[depth] = lettersRemaining;
                const score = evaluateCurrent();
                if (score > bestScore) {
                    bestScore = score;
                    bestPattern = current.slice();
                }
                return;
            }

            const maxLength = lettersRemaining - (wordsRemaining - 1);
            for (let length = 1; length <= maxLength; length++) {
                current[depth] = length;
                explore(depth + 1, lettersRemaining - length, wordsRemaining - 1);
            }
        };

        explore(0, totalLetters, words);

        const toWordString = (pattern: readonly number[]): string => {
            if (pattern.length === 0) {
                return "";
            }
            const parts: string[] = [];
            let offset = 0;
            for (const length of pattern) {
                let word = "";
                for (let i = 0; i < length; i++) {
                    const code = text[offset + i];
                    if (code !== 0) {
                        word += String.fromCharCode(code + 64);
                    }
                }
                offset += length;
                parts.push(word);
            }
            return parts.join(" ");
        };

        return {
            score: bestScore,
            bestSplit: bestPattern != null ? toWordString(bestPattern) : text.toString()
        };
    }
}

export const quadgrams = new Quadgrams(quadgramsJSON);
