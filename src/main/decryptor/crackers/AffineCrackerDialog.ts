/*
 * Copyright (C) 2025 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, signal } from "@angular/core";

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
    private running: Cancelable<void> | null = null;

    /** The results sorted by score. */
    public results = signal<AffineCrackerResult[]>([]);

    /** The progress of the current run in percent. */
    public progress = signal(0);

    public constructor() {
        super();
        this.cracker = new AffineCracker();
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
        this.running = this.cracker.crack(this.encoded, result => {
            const results = this.results().slice();
            results.push(result);
            results.sort((a, b) => b.getScore() - a.getScore());
            this.results.set(results);
        }, (current, max) => {
            this.progress.set(Math.round(100 * current / max));
        });
        void (async () => {
            await this.running;
            this.running = null;
        })();
    }

    /**
     * Stops cracking.
     */
    private async stop(): Promise<void> {
        if (this.running != null) {
            await this.running.cancel();
            this.running = null;
        }
    }

    /** @inheritdoc */
    public override close(value: { a: number, b: number } | null = null): void {
        void this.stop();
        super.close(value);
    }
}
