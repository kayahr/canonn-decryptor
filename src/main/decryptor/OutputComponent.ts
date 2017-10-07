/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Input, Component } from "@angular/core";
import { DecryptorOutput } from "./project/DecryptorOutput";
import { DialogService } from "../ui/DialogService";
import { SelectConverterDialog } from "./SelectConverterDialog";
import { createConverter, Converter } from "./converters/Converter";
import { ConverterOption } from "./converters/options/ConverterOption";
import { KeywordCrackerDialog } from "./crackers/KeywordCrackerDialog";
import { KeywordDecoder } from "./converters/KeywordDecoder";

/**
 * Decryptor output panel.
 */
@Component({
    selector: "decryptor-output",
    templateUrl: "assets/decryptor/output.html"
})
export class OutputComponent {
    @Input()
    protected output: DecryptorOutput;
    private dialogService: DialogService;

    public constructor(dialogService: DialogService) {
        this.dialogService = dialogService;
    }

    /**
     * Returns the output title which is the title of the used converter.
     *
     * @return The title.
     */
    public get title(): string {
        return this.output.getConverter().getTitle();
    }

    /**
     * Returns the current output value.
     *
     * @return The output value.
     */
    public get value(): string {
        return this.output.getValue();
    }

    /**
     * Returns the options of the converter used in this output.
     *
     * @return The converter options.
     */
    public get options(): ReadonlyArray<ConverterOption<any>> {
        return this.output.getConverter().getOptions();
    }

    /**
     * Returns the converter used by this output.
     *
     * @return The used converter.
     */
    public get converter(): Converter {
        return this.output.getConverter();
    }

    /**
     * Returns the child outputs of this output.
     *
     * @return The child outputs.
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
        if (converterId) {
            this.output.addOutput(new DecryptorOutput(createConverter(converterId)));
        }
    }

    /**
     * Checks if converter supports cracking.
     *
     * @return True if crackable, false if not.
     */
    public get crackable(): boolean {
        const converter = this.output.getConverter();
        return converter instanceof KeywordDecoder;
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
            if (keyword) {
                converter.setKeyword(keyword);
            }
        }
    }
}
