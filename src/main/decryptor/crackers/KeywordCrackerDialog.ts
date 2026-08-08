/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, signal } from "@angular/core";

import template from "../../../../assets/decryptor/crackers/keyword-cracker-dialog.html";
import { ButtonDirective } from "../../ui/ButtonDirective.ts";
import { Dialog } from "../../ui/Dialog.ts";
import { DialogComponent } from "../../ui/DialogComponent.ts";
import { contains } from "../../utils/array.ts";
import type { Cancelable } from "../../utils/Cancelable.ts";
import { KeywordCracker, type KeywordCrackerResult } from "./KeywordCracker.ts";

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
    public encoded = "";

    /** The current running cracking process. Null if none. */
    private runningTask: Cancelable<KeywordCrackerResult | null> | null = null;

    /** True while the cracker is running. */
    public readonly running = signal(false);

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
     * @param encoded - The encoded text to crack.
     */
    public init(encoded: string): void {
        this.encoded = encoded;
        this.start();
    }

    /**
     * Starts cracking.
     */
    public start(): void {
        if (this.runningTask == null) {
            this.run.update(run => run + 1);
            const runningTask = this.cracker.crack(this.encoded, result => {
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
            this.runningTask = runningTask;
            this.running.set(true);
            void (async () => {
                try {
                    await runningTask;
                    if (this.runningTask === runningTask) {
                        this.runningTask = null;
                        this.running.set(false);
                        this.start();
                    }
                } catch {
                    if (this.runningTask === runningTask) {
                        this.runningTask = null;
                        this.running.set(false);
                    }
                }
            })();
        }
    }

    /**
     * Stops cracking.
     */
    public async stop(): Promise<void> {
        const runningTask = this.runningTask;
        if (runningTask != null) {
            await runningTask.cancel();
            if (this.runningTask === runningTask) {
                this.runningTask = null;
                this.running.set(false);
            }
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
     * @returns True if results are empty, false if not.
     */
    public get emptyResult(): boolean {
        return this.results().length === 0;
    }

    /** @inheritdoc */
    public override close(value: string | null = null): void {
        void this.stop();
        super.close(value);
    }
}
