import { readFile } from "node:fs/promises";

import { diacriticsToAscii } from "../main/utils/string.js";

const WORD_REGEXP = /\b[A-Z]+\b/g;

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
        for (let i = 0, max = text.length - 4; i <= max; ++i) {
            this.addQuadgram(text.substring(i, i + 4));
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

async function processText(file: string, quadgrams: Quadgrams): Promise<void> {
    // Read text file and replace diacritics with plain ASCII
    let text = diacriticsToAscii(await readFile(file, "utf8"));

    // Remove [...] stuff used in Canonn articles for encrypted text. Makes no sense to decrypt data against ngrams created from encrypted data.
    text = text.replace(/\[.*?\]\s*/gs, "");

    // Split to lines
    const lines = text.split("\n");

    // Extract words from lines
    const words: string[] = [];
    for (const line of lines) {
        const matches = line.toUpperCase().match(WORD_REGEXP);
        if (matches != null) {
            words.push(...matches);
        }
    }

    // Build quadgrams
    quadgrams.processText(" " + words.join(" ") + " ");
}

async function main(args: string[]): Promise<number> {
    const quadgrams = new Quadgrams();

    for (const file of process.argv.slice(2)) {
        await processText(file, quadgrams);
    }
    console.log(JSON.stringify(quadgrams.toJSON(), null, 4));
    return 0;
}

process.exitCode = await main(process.argv);
