/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "./converters/Atbash.js";
import "./converters/Base64Decoder.js";
import "./converters/Base64Encoder.js";
import "./converters/CaesarDecoder.js";
import "./converters/CaesarEncoder.js";
import "./converters/KeywordDecoder.js";
import "./converters/KeywordEncoder.js";
import "./converters/MorseDecoder.js";
import "./converters/MorseEncoder.js";
import "./converters/NumberDecoder.js";
import "./converters/OneTimePadDecoder.js";
import "./converters/OneTimePadEncoder.js";
import "./converters/Reverse.js";
import "./converters/RomanDecoder.js";
import "./converters/RomanEncoder.js";
import "./converters/Rot13.js";
import "./converters/VigenereDecoder.js";
import "./converters/VigenereEncoder.js";

import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import template from "../../../assets/decryptor/decryptor.html?raw";
import { ProjectComponent } from "../project/ProjectComponent.js";
import { ProjectService } from "../project/ProjectService.js";
import { ButtonDirective } from "../ui/ButtonDirective.js";
import { DialogService } from "../ui/DialogService.js";
import { NoUpdateOnEditDirective } from "../ui/NoUpdateOnEditDirective.js";
import { ToastService } from "../ui/ToastService.js";
import { DecryptorState } from "./DecryptorState.js";
import { InputComponent } from "./InputComponent.js";
import { DecryptorInput } from "./project/DecryptorInput.js";
import { DecryptorProject } from "./project/DecryptorProject.js";

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
     * @return The current decryptor project.
     */
    public get project(): DecryptorProject {
        return this.state.getProject();
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
     * @return True if instructions should be shown, false if not.
     */
    public get showInstructions(): boolean {
        const inputs = this.state.getProject().getInputs();
        return inputs.every(input => input.getOutputs().length === 0) || inputs.every(input => input.getInput() === "");
    }
}
