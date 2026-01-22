import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";

import { diacriticsToAscii } from "../main/utils/string.ts";

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
    private index: Record<string, Quadgram> = {};

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

    public toJSON(): Record<string, number> {
        const json: Record<string, number> = {};
        const ngrams = this.quadgrams.sort((a, b) => b.count - a.count);
        for (const ngram of ngrams) {
            json[ngram.quadgram] = ngram.count;
        }
        return json;
    }
}

const numberWords = [ " ZERO ", " ONE ", " TWO ", " THREE ", " FOUR ", " FIVE ", " SIX ", " SEVEN ", " EIGHT ", " NINE " ];

/**
 * Converts numbers in the given line to words.
 *
 * @param line - The line to scan for numbers to replace.
 * @returns The line with numbers replaced with words.
 */
function numbersToText(line: string): string {
    return line.replace(/\d/g, match => numberWords[Number(match)]);
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
        const matches = numbersToText(line).toUpperCase().match(WORD_REGEXP);
        if (matches != null) {
            words.push(...matches);
        }
    }

    // Build quadgrams
    quadgrams.processText(` ${words.join(" ")} `);
}

async function processLines(file: string, quadgrams: Quadgrams): Promise<void> {
    const input = createReadStream(file, { highWaterMark: 1024 * 1024, encoding: "utf8" });
    const rl = createInterface({ input, crlfDelay: Infinity });
    try {
        let lines = 0;
        for await (let line of rl) {
            // Replace diacritics with plain ASCII
            line = diacriticsToAscii(line);

            // Extract words from lines
            const words = numbersToText(line).toUpperCase().match(WORD_REGEXP);
            if (words != null) {
                quadgrams.processText(` ${words.join(" ")} `);
            }

            lines++;
            if (lines % 100_000 === 0) {
                console.error(`Processed ${lines} lines`);
            }
        }
    } finally {
        rl.close();
        input.close();
    }
}

async function main(args: string[]): Promise<number> {
    const { values, positionals } = parseArgs({
        args,
        allowPositionals: true,
        allowNegative: true,
        strict: true,
        options: {
            lines: { type: "boolean", default: false, short: "l" }
        }
    });

    const quadgrams = new Quadgrams();

    for (const file of positionals) {
        if (values.lines) {
            await processLines(file, quadgrams);
        } else {
            await processText(file, quadgrams);
        }
    }
    console.log(JSON.stringify(quadgrams.toJSON(), null, 4));
    return 0;
}

process.exitCode = await main(process.argv.slice(2));
