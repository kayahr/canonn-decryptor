/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import quadgramsJSON from "../../../assets/fitness/ngrams.json" with { type: "json" };
import { FastString } from "../utils/FastString.js";

export class Quadgrams {
    private readonly scores: Map<string, number>;

    private readonly quadgrams: number[][][][] = [];

    public constructor(raw: { [ngram: string]: number }) {
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

    public getScore(text: FastString): number {
        let score = 0;
        const root = this.quadgrams;
        for (let i = 0, max = text.length - 3; i < max; ++i) {
            let j = i;
            const a = root[text[j]];
            if (a == null) continue;
            const b = a[text[++j]];
            if (b == null) continue;
            const c = b[text[++j]];
            if (c == null) continue;
            const d = c[text[++j]];
            if (d != null) score += d;
        }
        return score;
    }
}

export const quadgrams = new Quadgrams(quadgramsJSON);
