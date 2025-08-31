/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, signal } from "@angular/core";

import template from "../../../../assets/decryptor/crackers/keyword-cracker-dialog.html?raw";
import { ButtonDirective } from "../../ui/ButtonDirective.js";
import { Dialog } from "../../ui/Dialog.js";
import { DialogComponent } from "../../ui/DialogComponent.js";
import { contains } from "../../utils/array.js";
import { type Cancelable } from "../../utils/Cancelable.js";
import { KeywordCracker, KeywordCrackerResult } from "./KeywordCracker.js";

/**
 * Dialog for cracking the keyword of a keyword cipher.
 */
@Component({
    imports: [
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class KeywordCrackerDialog extends Dialog<string> {
    /** The cracker to use. */
    private readonly cracker: KeywordCracker;

    /** The encoded text. */
    public encoded: string = "";

    /** The current running cracking process. Null if none. */
    private running: Cancelable<KeywordCrackerResult | null> | null = null;

    /** The top 100 recorded cracker results sorted by score. */
    public results = signal<KeywordCrackerResult[]>([]);

    /** The current run. */
    public run = signal(0);

    /** The progress of the current run in percent. */
    public progress = signal(0);

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
        if (this.running == null) {
            this.run.update(run => run + 1);
            this.running = this.cracker.crack(this.encoded, result => {
                const origResults = this.results();
                if (!contains(origResults, result)) {
                    const results = origResults.slice();
                    const oldResult = results.find(v => v.getMessage() === result.getMessage());
                    if (oldResult != null) {
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
                    this.results.set(results.slice(0, 100));
                }
            }, (current, max) => {
                this.progress.set(Math.round(100 * current / max));
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
        if (this.running != null) {
            await this.running.cancel();
            this.running = null;
        }
    }

    /**
     * Clears the results.
     */
    public async clear(): Promise<void> {
        await this.stop();
        this.run.set(0);
        this.progress.set(0);
        this.results.set([]);
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
    public override close(value: string | null = null): void {
        void this.stop();
        super.close(value);
    }
}
