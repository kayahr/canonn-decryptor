/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { DecryptorState } from "./DecryptorState";
import { DecryptorProject } from "./project/DecryptorProject";
import { DecryptorInput } from "./project/DecryptorInput";
import { Component } from "@angular/core";
import { ProjectComponent } from "../project/ProjectComponent";
import { ProjectService } from "../project/ProjectService";
import { DialogService } from "../ui/DialogService";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "../ui/ToastService";

/**
 * The main component of the decryptor module.
 */
@Component({
    selector: "decryptor",
    templateUrl: "assets/decryptor/decryptor.html"
})
export class DecryptorComponent extends ProjectComponent<DecryptorProject> {
    /**
     * Creates a new decryptor component showing the specified state and using the specified service for loading
     * and saving.
     *
     * @param state    The decryptor state holding the current decryptor project.
     * @param service  The decryptor service used for loading and saving projects.
     */
    public constructor(state: DecryptorState, projectService: ProjectService, dialogService: DialogService,
            toastService: ToastService, router: Router, activatedRoute: ActivatedRoute) {
        super(DecryptorProject, state, projectService, dialogService, toastService, router, activatedRoute);
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
