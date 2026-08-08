/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, DestroyRef, inject, signal } from "@angular/core";

import template from "../../../../assets/decryptor/crackers/affine-cracker-dialog.html";
import { ButtonDirective } from "../../ui/ButtonDirective.ts";
import { Dialog } from "../../ui/Dialog.ts";
import { DialogComponent } from "../../ui/DialogComponent.ts";
import type { Cancelable } from "../../utils/Cancelable.ts";
import { AffineCracker, type AffineCrackerResult } from "./AffineCracker.ts";

/**
 * Dialog for cracking the affine cipher.
 */
@Component({
    imports: [
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class AffineCrackerDialog extends Dialog<{ a: number, b: number }> {
    /** The cracker to use. */
    private readonly cracker: AffineCracker;

    /** The encoded text. */
    public encoded = "";

    /** The current running cracking process. Null if none. */
    private runningTask: Cancelable<void> | null = null;

    /** True while the cracker is running. */
    public readonly running = signal(false);

    /** The results sorted by score. */
    public results = signal<AffineCrackerResult[]>([]);

    /** The progress of the current run in percent. */
    public progress = signal(0);

    public constructor() {
        super();
        this.cracker = new AffineCracker();
        inject(DestroyRef).onDestroy(() => {
            void this.stop().catch(() => {});
        });
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
        const runningTask = this.cracker.crack(this.encoded, result => {
            const results = this.results().slice();
            results.push(result);
            results.sort((a, b) => b.getScore() - a.getScore());
            this.results.set(results);
        }, (current, max) => {
            this.progress.set(Math.round(100 * current / max));
        });
        this.runningTask = runningTask;
        this.running.set(true);
        void (async () => {
            try {
                await runningTask;
            } catch {
                // Cancellation is expected when the dialog is closed.
            } finally {
                if (this.runningTask === runningTask) {
                    this.runningTask = null;
                    this.running.set(false);
                }
            }
        })();
    }

    /**
     * Stops cracking.
     */
    private async stop(): Promise<void> {
        const runningTask = this.runningTask;
        if (runningTask != null) {
            this.runningTask = null;
            this.running.set(false);
            await runningTask.cancel();
        }
    }

    /** @inheritdoc */
    public override close(value: { a: number, b: number } | null = null): void {
        void this.stop().catch(() => {});
        super.close(value);
    }
}
