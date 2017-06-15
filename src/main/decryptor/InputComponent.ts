/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, Input } from "@angular/core";
import { DecryptorInput } from "./project/DecryptorInput";
import { DecryptorOutput } from "./project/DecryptorOutput";
import { DecryptorState } from "./DecryptorState";
import { DialogService } from "../ui/DialogService";
import { SelectConverterDialog } from "./SelectConverterDialog";
import { createConverter } from "./converters/Converter";

/**
 * Decryptor input panel.
 */
@Component({
    selector: "decryptor-input",
    templateUrl: "assets/decryptor/input.html"
})
export class InputComponent {
    private state: DecryptorState;
    private dialogService: DialogService;

    /** The decryptor input.  */
    @Input()
    public input: DecryptorInput;

    public constructor(state: DecryptorState, dialogService: DialogService) {
        this.state = state;
        this.dialogService = dialogService;
    }

    /**
     * Returns the input data.
     *
     * @return The input data.
     */
    public get value(): string {
        return this.input.getInput();
    }

    /**
     * Sets the input data.
     *
     * @param value  The input data to set.
     */
    public set value(value: string) {
        this.input.setInput(value);
    }

    /**
     * Returns the outputs connected to this input.
     *
     * @return The connected outputs.
     */
    public get outputs(): DecryptorOutput[] {
        return this.input.getOutputs();
    }

    /**
     * Checks if this input is removable. When there is only one input then it can't be removed.
     *
     * @return True if input is removable, false if not.
     */
    public get removable(): boolean {
        return this.state.getProject().getInputs().length > 1;
    }

    /**
     * Removes this input after the user has confirmed it.
     */
    public async remove(): Promise<void> {
        if (await this.dialogService.confirm("Are you sure you want to delete this input?")) {
            this.state.getProject().removeInput(this.input);
        }
    }

    /**
     * Adds an output to this input after the user has selected a converter for it.
     */
    public async addOutput(): Promise<void> {
        const converterId = await this.dialogService.openDialog(SelectConverterDialog);
        if (converterId) {
            this.input.addOutput(new DecryptorOutput(createConverter(converterId)));
        }
    }
}
