/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, type ElementRef, Input, ViewChild, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/input.html";
import { ButtonDirective } from "../ui/ButtonDirective.ts";
import { DialogService } from "../ui/DialogService.ts";
import { FocusDirective } from "../ui/FocusDirective.ts";
import { createConverter } from "./converters/Converter.ts";
import { DecryptorState } from "./DecryptorState.ts";
import { OutputComponent } from "./OutputComponent.ts";
import type { DecryptorInput } from "./project/DecryptorInput.ts";
import { DecryptorOutput } from "./project/DecryptorOutput.ts";
import { SelectConverterDialog } from "./SelectConverterDialog.ts";

/**
 * Decryptor input panel.
 */
@Component({
    imports: [
        OutputComponent,
        FormsModule,
        ButtonDirective,
        FocusDirective
    ],
    selector: "decryptor-input",
    template
})
export class InputComponent {
    private readonly state = inject(DecryptorState);
    private readonly dialogService = inject(DialogService);

    /** The decryptor input.  */
    @Input()
    public input: DecryptorInput | null = null;

    @ViewChild("removeButton")
    protected removeButton!: ElementRef<HTMLButtonElement>;

    /**
     * Returns the input data.
     *
     * @returns The input data.
     */
    public get value(): string {
        return this.input?.getInput() ?? "";
    }

    /**
     * Sets the input data.
     *
     * @param value  The input data to set.
     */
    public set value(value: string) {
        this.input?.setInput(value);
    }

    /**
     * Returns the outputs connected to this input.
     *
     * @returns The connected outputs.
     */
    public get outputs(): DecryptorOutput[] {
        return this.input?.getOutputs() ?? [];
    }

    /**
     * Checks if this input is removable. When there is only one input then it can't be removed.
     *
     * @returns True if input is removable, false if not.
     */
    public get removable(): boolean {
        return this.state.getProject().getInputs().length > 1;
    }

    /**
     * Removes this input after the user has confirmed it.
     */
    public async remove(): Promise<void> {
        if (this.input != null && await this.dialogService.confirm("Are you sure you want to delete this input?", { owner: this.removeButton.nativeElement })) {
            this.state.getProject().removeInput(this.input);
        }
    }

    /**
     * Adds an output to this input after the user has selected a converter for it.
     */
    public async addOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId != null) {
            this.input?.addOutput(new DecryptorOutput(createConverter(converterId)));
        }
    }
}
