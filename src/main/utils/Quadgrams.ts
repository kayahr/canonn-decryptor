import * as quadgramsJSON from "../../../assets/fitness/ngrams.json";
import { FastString } from "../utils/FastString";

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

            const ngram2 = Array.prototype.map.call(ngram, (char: string) => Math.max(0, char.charCodeAt(0) - 64));

            let char = ngram2[0];
            let a = this.quadgrams[char];
            if (!a) a = this.quadgrams[char] = [];
            char = ngram2[1];
            let b = a[char];
            if (!b) b = a[char] = [];
            char = ngram2[2];
            let c = b[char];
            if (!c) c = b[char] = [];
            c[ngram2[3]] = score;
        }
    }

    public getScore(text: FastString): number {
        let score = 0;
        const root = this.quadgrams;
        for (let i = 0, max = text.length - 3; i !== max; ++i) {
            let j = i;
            const a = root[text[j]];
            if (!a) continue;
            const b = a[text[++j]];
            if (!b) continue;
            const c = b[text[++j]];
            if (!c) continue;
            const d = c[text[++j]];
            if (d) score += d;
        }
        return score;
    }
}

export const quadgrams = new Quadgrams(quadgramsJSON);
