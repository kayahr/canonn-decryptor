/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { quadgrams } from "../../utils/Quadgrams";
import { FastString } from "../../utils/FastString";
import { Alphabet } from "../../utils/Alphabet";
import { KeywordDecoder } from "../converters/KeywordDecoder";
import { sleep } from "../../utils/async";
import { Cancelable } from "../../utils/Cancelable";
import { cancelable } from "../../utils/promise";
import { Canceled } from "../../utils/Canceled";
import { Equatable, isEqual } from "../../utils/Equatable";

/**
 * A single keyword cracker result.
 */
export class KeywordCrackerResult implements Equatable {
    /** The score of the decoded message. The higher the more likely this is a real english text. */
    private score: number;

    /** The keyword with which the text was encrypted. */
    private keyword: string;

    /** The decoded message. */
    private message: string;

    /**
     * Creates a new keyword cracker result.
     *
     * @param score    The score of the decoded message. The higher the more likely this is a real english text.
     * @param keyword  The keyword with which the text was encrypted.
     * @param message  The decoded message.
     */
    public constructor(score: number, keyword: string, message: string) {
        this.score = score;
        this.keyword = keyword;
        this.message = message;
    }

    /** @inheritDoc */
    public equals(obj: any): boolean {
        return isEqual(this, obj, other => other.score === this.score && other.keyword === this.keyword
            && other.message === this.message);
    }

    /**
     * Returns the score of the decoded message. The higher the more likely this is a real english text.
     *
     * @return The score of the decoded message.
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * Returns the keyword with which the text was encrypted.
     *
     * @return The keyword.
     */
    public getKeyword(): string {
        return this.keyword;
    }

    /**
     * Returns the decoded message.
     *
     * @return The decoded message.
     */
    public getMessage(): string {
        return this.message;
    }
}

/**
 * Alphabet substitution cracker based on the hill climbing algorithm.
 *
 * http://practicalcryptography.com/cryptanalysis/stochastic-searching/cryptanalysis-simple-substitution-cipher/
 */
export class KeywordCracker {
    /**
     * Factor which specifies how far the score is allowed to get down hill again. The factor is multiplied by the
     * length of the encoded message and divided by the a divisor controlled by [[initialDivisor]] and
     * [[divisorIncrement]].
     */
    private readonly fudgeFactor = 0.2;

    /** The initial value of the [[fudgeFactor]] divisor in a cycle. */
    private readonly initialDivisor = 1;

    /** The [[fudgeFactor]] divisor gets incremented by this value after each cycle. */
    private readonly divisorIncrement = 1;

    /** How many cycles in each try. */
    private readonly cycles = 50;

    /** How many tries. */
    private readonly maxTries = 50000;

    /**
     * Creates the shortest possible keyword from the given alphabet sufficient to decode the given encoded message
     * to the given decoded message.
     *
     * @param alphabet  The alphabet used to decode the encoded string to the decoded string.
     * @param encoded   The encoded string.
     * @param decoded   The decoded string.
     * @return The keyword.
     */
    private createKeyword(alphabet: Alphabet, encoded: FastString, decoded: FastString): string {
        const inverted = alphabet.clone().invert();
        const testAlphabet = new Alphabet();
        const testEncoded = new FastString();
        let len = 1;
        while (len < 26) {
            inverted.clone(testAlphabet).trim(len);
            decoded.substitute(testAlphabet, testEncoded);
            if (testEncoded.equals(encoded)) {
                break;
            }
            len++;
        }
        return inverted.toString().substr(0, len);
    }

    /**
     * Tries to crack the given encoded message.
     *
     * @param encoded  The encoded message.
     * @param onResult  Callback called with a cracker result every time a better score has been achieved.
     * @return The best cracker result or null when none.
     */
    public crack(encoded: string, onResult?: (result: KeywordCrackerResult) => void,
            onProgress?: (current: number, max: number) => void): Cancelable<KeywordCrackerResult | null> {
        let cancel: Canceled | null = null;
        return cancelable(async () => {
            const decoder = new KeywordDecoder();
            let fastEncoded = FastString.fromString(encoded);
            let bestResult: KeywordCrackerResult | null = null;
            const fudgeFactor = this.fudgeFactor * fastEncoded.length;
            let alphabet = Alphabet.createRandom();
            const decoded = fastEncoded.substitute(alphabet, new FastString());
            let score = quadgrams.getScore(decoded);
            let bestScore = score;
            let newAlphabet = new Alphabet();
            let tries = 0;
            while (tries < this.maxTries) {
                if (onProgress) {
                    onProgress(tries * this.cycles, this.maxTries * this.cycles);
                }
                let divisor = this.initialDivisor;
                alphabet.clone(newAlphabet);
                for (let cycle = 0; cycle !== this.cycles; ++cycle) {
                    if (cancel) {
                        throw cancel;
                    }
                    ++tries;
                    let a = 1 + Math.round(Math.random() * 25);
                    let b = 1 + Math.round(Math.random() * 25);
                    newAlphabet.swap(a, b);
                    const newScore = quadgrams.getScore(fastEncoded.substitute(newAlphabet, decoded));
                    if (newScore >= bestScore) {
                        bestScore = newScore;
                        const keyword = this.createKeyword(newAlphabet, fastEncoded, decoded);
                        decoder.setKeyword(keyword);
                        bestResult = new KeywordCrackerResult(newScore, keyword, decoder.convert(encoded));
                        if (onResult) {
                            onResult(bestResult);
                        }
                    }
                    if (newScore > score - (fudgeFactor / divisor)) {
                        score = newScore;
                        newAlphabet.clone(alphabet);
                    } else {
                        newAlphabet.swap(a, b);
                    }
                    divisor += this.divisorIncrement;
                }
                await sleep();
            }
            return bestResult;
        }, (canceled: Canceled) => {
            cancel = canceled;
        });
    }
}
