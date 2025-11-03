/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "./converters/AffineDecoder.ts";
import "./converters/AffineEncoder.ts";
import "./converters/Atbash.ts";
import "./converters/Base64Decoder.ts";
import "./converters/Base64Encoder.ts";
import "./converters/CaesarDecoder.ts";
import "./converters/CaesarEncoder.ts";
import "./converters/KeywordDecoder.ts";
import "./converters/KeywordEncoder.ts";
import "./converters/MorseDecoder.ts";
import "./converters/MorseEncoder.ts";
import "./converters/NumberDecoder.ts";
import "./converters/NumberEncoder.ts";
import "./converters/PolybiusDecoder.ts";
import "./converters/PolybiusEncoder.ts";
import "./converters/Reverse.ts";
import "./converters/RomanDecoder.ts";
import "./converters/RomanEncoder.ts";
import "./converters/Rot13.ts";
import "./converters/VigenereDecoder.ts";
import "./converters/VigenereEncoder.ts";

import { Component, type ElementRef, ViewChild, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import template from "../../../assets/decryptor/decryptor.html";
import { ProjectComponent } from "../project/ProjectComponent.ts";
import { ProjectService } from "../project/ProjectService.ts";
import { ButtonDirective } from "../ui/ButtonDirective.ts";
import { DialogService } from "../ui/DialogService.ts";
import { NoUpdateOnEditDirective } from "../ui/NoUpdateOnEditDirective.ts";
import { ToastService } from "../ui/ToastService.ts";
import { DecryptorState } from "./DecryptorState.ts";
import { InputComponent } from "./InputComponent.ts";
import { DecryptorInput } from "./project/DecryptorInput.ts";
import { DecryptorProject } from "./project/DecryptorProject.ts";

/**
 * The main component of the decryptor module.
 */
@Component({
    selector: "decryptor",
    imports: [
        FormsModule,
        InputComponent,
        NoUpdateOnEditDirective,
        ButtonDirective
    ],
    template
})
export class DecryptorComponent extends ProjectComponent<DecryptorProject> {
    @ViewChild("clearButton")
    protected clearButton!: ElementRef<HTMLButtonElement>;

    /**
     * Creates a new decryptor component showing the specified state and using the specified service for loading
     * and saving.
     */
    public constructor() {
        super(
            DecryptorProject,
            inject(DecryptorState),
            inject(ProjectService),
            inject(DialogService),
            inject(ToastService),
            inject(Router),
            inject(ActivatedRoute)
        );
    }

    /**
     * Returns the current decryptor project.
     *
     * @returns The current decryptor project.
     */
    public get project(): DecryptorProject {
        return this.state.getProject();
    }

    /**
     * True if the current project is empty (initial state).
     */
    public get empty(): boolean {
        return this.state.getProject().isEmpty();
    }

    /**
     * Clears the current project after user confirmation.
     */
    public async clear(): Promise<void> {
        if (await this.dialogService.confirm("Are you sure you want to clear the project?", { owner: this.clearButton.nativeElement })) {
            this.state.getProject().clear();
            this.toastService.showToast("Project has been cleared");
        }
    }

    /**
     * Adds a new input to the project.
     */
    public addInput(): void {
        this.state.getProject().addInput(new DecryptorInput());
    }

    /**
     * Check if instructions should be shown. This is the case when there are no outputs, just inputs or when all
     * inputs are empty.
     *
     * @returns True if instructions should be shown, false if not.
     */
    public get showInstructions(): boolean {
        const inputs = this.state.getProject().getInputs();
        return inputs.every(input => input.getOutputs().length === 0) || inputs.every(input => input.getInput() === "");
    }
}
