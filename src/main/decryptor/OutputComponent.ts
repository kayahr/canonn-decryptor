/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, type ElementRef, Input, ViewChild, computed, inject, signal } from "@angular/core";

import template from "../../../assets/decryptor/output.html";
import { ButtonDirective } from "../ui/ButtonDirective.ts";
import { DialogService } from "../ui/DialogService.ts";
import { BooleanOptionComponent } from "./BooleanOptionComponent.ts";
import { AffineDecoder } from "./converters/AffineDecoder.ts";
import { type Converter, createConverter } from "./converters/Converter.ts";
import { KeywordDecoder } from "./converters/KeywordDecoder.ts";
import type { ConverterOption } from "./converters/options/ConverterOption.ts";
import { AffineCrackerDialog } from "./crackers/AffineCrackerDialog.ts";
import { KeywordCrackerDialog } from "./crackers/KeywordCrackerDialog.ts";
import { NumberOptionComponent } from "./NumberOptionComponent.ts";
import { DecryptorOutput } from "./project/DecryptorOutput.ts";
import { SelectConverterDialog } from "./SelectConverterDialog.ts";
import { SelectOptionComponent } from "./SelectOptionComponent.ts";
import { StringOptionComponent } from "./StringOptionComponent.ts";

/**
 * Decryptor output panel.
 */
@Component({
    selector: "decryptor-output",
    imports: [
        StringOptionComponent,
        NumberOptionComponent,
        BooleanOptionComponent,
        SelectOptionComponent,
        ButtonDirective
    ],
    template
})
export class OutputComponent {
    private readonly outputState = signal<DecryptorOutput | null>(null);

    @Input({ required: true })
    protected set output(output: DecryptorOutput) {
        this.outputState.set(output);
    }

    private readonly dialogService = inject(DialogService);

    @ViewChild("removeButton")
    protected removeButton!: ElementRef<HTMLButtonElement>;

    /** Returns the configured decryptor output. */
    private getOutput(): DecryptorOutput {
        return this.outputState()!;
    }

    /**
     * Returns the output title which is the title of the used converter.
     *
     * @returns The title.
     */
    public readonly title = computed(() => this.getOutput().getConverter().getTitle());

    /**
     * Returns the current output value.
     *
     * @returns The output value.
     */
    public readonly value = computed(() => this.getOutput().getValue());

    /**
     * Returns the options of the converter used in this output.
     *
     * @returns The converter options.
     */
    public readonly options = computed<readonly ConverterOption[]>(() => this.getOutput().getConverter().getOptions());

    /**
     * Returns the converter used by this output.
     *
     * @returns The used converter.
     */
    public readonly converter = computed<Converter>(() => this.getOutput().getConverter());

    /**
     * Returns the child outputs of this output.
     *
     * @returns The child outputs.
     */
    public readonly outputs = computed(() => this.getOutput().getOutputs());

    /**
     * Removes this decryptor output. User has to confirm it first.
     */
    public async remove(): Promise<void> {
        const output = this.getOutput();
        if (await this.dialogService.confirm("Are you sure you want to delete this output?", { owner: this.removeButton.nativeElement })) {
            output.getParent().addOutputs(output.getOutputs());
            output.remove();
        }
    }

    /**
     * Appends an output to this output. User has to select a converter for the new output first.
     */
    public async addOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            this.getOutput().addOutput(new DecryptorOutput(createConverter(converterId)));
        }
    }

    /**
     * Replaces this output. User has to select a converter for the new output first.
     */
    public async replace(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            const newOutput = new DecryptorOutput(createConverter(converterId));
            this.getOutput().replace(newOutput);
        }
    }

    /**
     * Inserts an output as parent of this one.
     */
    public async insertOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            const newOutput = new DecryptorOutput(createConverter(converterId));
            this.getOutput().insertParent(newOutput);
        }
    }

    /**
     * Checks if converter supports cracking.
     *
     * @returns True if crackable, false if not.
     */
    public readonly crackable = computed(() => {
        const converter = this.getOutput().getConverter();
        return converter instanceof KeywordDecoder || converter instanceof AffineDecoder;
    });

    /**
     * Starts the cracking process if converter supports it.
     */
    public async crack(): Promise<void> {
        const output = this.getOutput();
        const converter = output.getConverter();
        if (converter instanceof KeywordDecoder) {
            const keyword = await this.dialogService.openDialog(KeywordCrackerDialog, {
                init: dialog => {
                    dialog.init(output.getParent().getValue());
                }
            });
            if (keyword != null) {
                converter.keyword = keyword;
            }
        } else if (converter instanceof AffineDecoder) {
            const result = await this.dialogService.openDialog(AffineCrackerDialog, {
                init: dialog => {
                    dialog.init(output.getParent().getValue());
                }
            });
            if (result != null) {
                converter.a = String(result.a);
                converter.b = String(result.b);
            }
        }
    }
}
