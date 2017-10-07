/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { Dialog } from "../../ui/Dialog";
import { KeywordCracker, KeywordCrackerResult } from "./KeywordCracker";
import { Cancelable } from "../../utils/Cancelable";
import { contains } from "../../utils/array";

/**
 * Dialog for cracking the keyword of a keyword cipher.
 */
@Component({
    templateUrl: "assets/decryptor/crackers/keyword-cracker-dialog.html"
})
export class KeywordCrackerDialog extends Dialog<string> {
    /** The cracker to use. */
    private readonly cracker: KeywordCracker;

    /** The encoded text. */
    public encoded: string;

    /** The current running cracking process. Null if none. */
    private running: Cancelable<KeywordCrackerResult | null> | null = null;

    /** The top 100 recorded cracker results sorted by score. */
    public results: KeywordCrackerResult[] = [];

    /** The current run. */
    public run = 0;

    /** The progress of the current run in percent. */
    public progress = 0;

    public constructor() {
        super();
        this.cracker = new KeywordCracker();
    }

    /**
     * Initializes the dialog with the given encoded text to crack. Cracking starts right away.
     *
     * @param encoded  The encoded text to crack.
     */
    public init(encoded: string): void {
        this.encoded = encoded;
        this.start();
    }

    /**
     * Starts cracking.
     */
    public start(): void {
        if (!this.running) {
            this.run++;
            this.running = this.cracker.crack(this.encoded, result => {
                if (!contains(this.results, result)) {
                    const results = this.results.slice();
                    const oldResult = results.find(v => v.getMessage() === result.getMessage());
                    if (oldResult) {
                        if (result.getKeyword().length < oldResult.getKeyword().length) {
                            results.splice(results.indexOf(oldResult), 1, result);
                        }
                    } else {
                        results.push(result);
                    }
                    results.sort((a, b) => {
                        const scoreDiff = b.getScore() - a.getScore();
                        if (scoreDiff === 0) {
                            return a.getKeyword().length - b.getKeyword().length;
                        }
                        return scoreDiff;
                    });
                    this.results = results.slice(0, 100);
                }
            }, (current, max) => {
                this.progress = Math.round(100 * current / max);
            });
            this.running.then(() => {
                this.running = null;
                this.start();
            }, () => {
                this.running = null;
            });
        }
    }

    /**
     * Stops cracking.
     */
    public async stop(): Promise<void> {
        if (this.running) {
            await this.running.cancel();
            this.running = null;
        }
    }

    /**
     * Clears the results.
     */
    public async clear(): Promise<void> {
        await this.stop();
        this.run = 0;
        this.progress = 0;
        this.results = [];
    }

    /**
     * Checks if results are empty.
     *
     * @return True if results are empty, false if not.
     */
    public get emptyResult(): boolean {
        return this.results.length === 0;
    }

    /** @inheritDoc */
    public close(value: string | null = null): void {
        this.stop();
        super.close(value);
    }
}
