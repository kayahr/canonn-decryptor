/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, type ElementRef, Input, ViewChild, inject } from "@angular/core";

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
    @Input()
    protected output!: DecryptorOutput;

    private readonly dialogService = inject(DialogService);

    @ViewChild("removeButton")
    protected removeButton!: ElementRef<HTMLButtonElement>;

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
        if (await this.dialogService.confirm("Are you sure you want to delete this output?", { owner: this.removeButton.nativeElement })) {
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
            const keyword = await this.dialogService.openDialog(KeywordCrackerDialog, {
                init: dialog => {
                    dialog.init(this.output.getParent().getValue());
                }
            });
            if (keyword != null) {
                converter.keyword = keyword;
            }
        } else if (converter instanceof AffineDecoder) {
            const result = await this.dialogService.openDialog(AffineCrackerDialog, {
                init: dialog => {
                    dialog.init(this.output.getParent().getValue());
                }
            });
            if (result != null) {
                converter.a = String(result.a);
                converter.b = String(result.b);
            }
        }
    }
}
