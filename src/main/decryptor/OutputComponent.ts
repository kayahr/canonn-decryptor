/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, inject, Input } from "@angular/core";

import template from "../../../assets/decryptor/output.html?raw";
import { ButtonDirective } from "../ui/ButtonDirective.js";
import { DialogService } from "../ui/DialogService.js";
import { BooleanOptionComponent } from "./BooleanOptionComponent.js";
import { AffineDecoder } from "./converters/AffineDecoder.js";
import { Converter, createConverter } from "./converters/Converter.js";
import { KeywordDecoder } from "./converters/KeywordDecoder.js";
import { ConverterOption } from "./converters/options/ConverterOption.js";
import { AffineCrackerDialog } from "./crackers/AffineCrackerDialog.js";
import { KeywordCrackerDialog } from "./crackers/KeywordCrackerDialog.js";
import { NumberOptionComponent } from "./NumberOptionComponent.js";
import { DecryptorOutput } from "./project/DecryptorOutput.js";
import { SelectConverterDialog } from "./SelectConverterDialog.js";
import { SelectOptionComponent } from "./SelectOptionComponent.js";
import { StringOptionComponent } from "./StringOptionComponent.js";

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
    @Input()
    protected output!: DecryptorOutput;

    private readonly dialogService = inject(DialogService);

    /**
     * Returns the output title which is the title of the used converter.
     *
     * @returns The title.
     */
    public get title(): string {
        return this.output.getConverter().getTitle();
    }

    /**
     * Returns the current output value.
     *
     * @returns The output value.
     */
    public get value(): string {
        return this.output.getValue();
    }

    /**
     * Returns the options of the converter used in this output.
     *
     * @returns The converter options.
     */
    public get options(): readonly ConverterOption[] {
        return this.output.getConverter().getOptions();
    }

    /**
     * Returns the converter used by this output.
     *
     * @returns The used converter.
     */
    public get converter(): Converter {
        return this.output.getConverter();
    }

    /**
     * Returns the child outputs of this output.
     *
     * @returns The child outputs.
     */
    public get outputs(): DecryptorOutput[] {
        return this.output.getOutputs();
    }

    /**
     * Removes this decryptor output. User has to confirm it first.
     */
    public async remove(): Promise<void> {
        if (await this.dialogService.confirm("Are you sure you want to delete this output?")) {
            this.output.getParent().addOutputs(this.output.getOutputs());
            this.output.remove();
        }
    }

    /**
     * Appends an output to this output. User has to select a converter for the new output first.
     */
    public async addOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            this.output.addOutput(new DecryptorOutput(createConverter(converterId)));
        }
    }

    /**
     * Replaces this output. User has to select a converter for the new output first.
     */
    public async replace(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            const newOutput = new DecryptorOutput(createConverter(converterId));
            this.output.replace(newOutput);
            this.output = newOutput;
        }
    }

    /**
     * Inserts an output as parent of this one.
     */
    public async insertOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            const newOutput = new DecryptorOutput(createConverter(converterId));
            this.output.insertParent(newOutput);
        }
    }

    /**
     * Checks if converter supports cracking.
     *
     * @returns True if crackable, false if not.
     */
    public get crackable(): boolean {
        const converter = this.output.getConverter();
        return converter instanceof KeywordDecoder || converter instanceof AffineDecoder;
    }

    /**
     * Starts the cracking process if converter supports it.
     */
    public async crack(): Promise<void> {
        const converter = this.output.getConverter();
        if (converter instanceof KeywordDecoder) {
            const keyword = await this.dialogService.openDialog(KeywordCrackerDialog, dialog => {
                dialog.init(this.output.getParent().getValue());
            });
            if (keyword != null) {
                converter.keyword = keyword;
            }
        } else if (converter instanceof AffineDecoder) {
            const result = await this.dialogService.openDialog(AffineCrackerDialog, dialog => {
                dialog.init(this.output.getParent().getValue());
            });
            if (result != null) {
                converter.a = String(result.a);
                converter.b = String(result.b);
            }
        }
    }
}
