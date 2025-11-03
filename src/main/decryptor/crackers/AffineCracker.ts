/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { sleep } from "../../utils/async.ts";
import type { Cancelable } from "../../utils/Cancelable.ts";
import type { Canceled } from "../../utils/Canceled.ts";
import { type Equatable, isEqual } from "../../utils/Equatable.ts";
import { FastString } from "../../utils/FastString.ts";
import { cancelable } from "../../utils/promise.ts";
import { quadgrams } from "../../utils/Quadgrams.ts";
import { aTable, k } from "../converters/AffineCipher.ts";
import { AffineDecoder } from "../converters/AffineDecoder.ts";

/**
 * A single affine cracker result.
 */
export class AffineCrackerResult implements Equatable {
    /** The score of the decoded message. The higher the more likely this is a real english text. */
    private readonly score: number;

    /** The a value with which the text was encrypted. */
    private readonly a: number;

    /** The b value with which the text was encrypted. */
    private readonly b: number;

    /** The decoded message. */
    private readonly message: string;

    /**
     * Creates a new affine cracker result.
     *
     * @param score   - The score of the decoded message. The higher the more likely this is a real english text.
     * @param a       - The a value with which the text was encrypted.
     * @param b       - The b value with which the text was encrypted.
     * @param message - The decoded message.
     */
    public constructor(score: number, a: number, b: number, message: string) {
        this.score = score;
        this.a = a;
        this.b = b;
        this.message = message;
    }

    /** @inheritdoc */
    public equals(obj: unknown): boolean {
        return isEqual(this, obj, other => other.score === this.score && other.a === this.a && other.b === this.b
            && other.message === this.message);
    }

    /**
     * Returns the score of the decoded message. The higher the more likely this is a real english text.
     *
     * @returns The score of the decoded message.
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * Returns the a value with which the text was encrypted.
     *
     * @returns The a value.
     */
    public getA(): number {
        return this.a;
    }

    /**
     * Returns the b value with which the text was encrypted.
     *
     * @returns The b value.
     */
    public getB(): number {
        return this.b;
    }

    /**
     * Returns the decoded message.
     *
     * @returns The decoded message.
     */
    public getMessage(): string {
        return this.message;
    }
}

/**
 * Affine cipher cracker. Simply brute forces all possibilities.
 */
export class AffineCracker {
    /**
     * Tries to crack the given encoded message.
     *
     * @param encoded  - The encoded message.
     * @param onResult - Callback called whenever a new result was calculated.
     */
    public crack(encoded: string, onResult?: (result: AffineCrackerResult) => void, onProgress?: (current: number, max: number) => void): Cancelable<void> {
        let cancel: Canceled | null = null;
        return cancelable(async () => {
            const max = aTable.length * k;
            let current = 0;
            const decoder = new AffineDecoder();
            for (const a of aTable) {
                for (let b = 0; b < k; b++) {
                    if (cancel != null) {
                        throw cancel;
                    }
                    decoder.a = String(a);
                    decoder.b = String(b);
                    const decoded = decoder.convert(encoded);
                    const score = quadgrams.getScore(FastString.fromString(decoded));
                    const result = new AffineCrackerResult(score, a, b, decoded);
                    onResult?.(result);
                    current++;
                    onProgress?.(current, max);
                    await sleep(0);
                }
            }
        }, (canceled: Canceled) => {
            cancel = canceled;
        });
    }
}
