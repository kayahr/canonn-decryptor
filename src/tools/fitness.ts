import * as fs from "fs";

import { diacriticsToAscii } from "../main/utils/string.js";

// eslint-disable-next-line regexp/no-unused-capturing-group
const WORD_REGEXP = /\b([A-Z]+)\b/g;

class Quadgram {
    public readonly quadgram: string;

    public count: number;

    public constructor(word: string) {
        this.quadgram = word;
        this.count = 1;
    }
}

class Quadgrams {
    private readonly quadgrams: Quadgram[] = [];
    private index: { [quadgram: string]: Quadgram } = {};

    public addQuadgram(quadgram: string): void {
        const entry = this.index[quadgram];
        if (entry != null) {
            ++entry.count;
        } else {
            this.quadgrams.push(this.index[quadgram] = new Quadgram(quadgram));
        }
    }

    public processText(text: string): void {
        for (let i = 0, max = Math.max(1, text.length - 3); i !== max; ++i) {
            this.addQuadgram(text.substring(i, 4));
        }
    }

    public toJSON(): { [ngram: string]: number } {
        const json: { [ngram: string]: number } = {};
        const ngrams = this.quadgrams.sort((a, b) => b.count - a.count);
        for (const ngram of ngrams) {
            json[ngram.quadgram] = ngram.count;
        }
        return json;
    }
}

function processText(file: string, quadgrams: Quadgrams): void {
    const text = fs.readFileSync(file).toString().toUpperCase();
    const matches = text.match(WORD_REGEXP);
    if (matches != null) {
        quadgrams.processText(" " + diacriticsToAscii(matches.join(" ")) + " ");
    }
}

function main(args: string[]): number {
    const quadgrams = new Quadgrams();

    for (const file of process.argv.slice(2)) {
        processText(file, quadgrams);
    }
    console.log(JSON.stringify(quadgrams.toJSON(), null, 4));
    return 0;
}

process.exitCode = main(process.argv);
