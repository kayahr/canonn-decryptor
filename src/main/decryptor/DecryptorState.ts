/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Injectable } from "@angular/core";

import { ProjectState } from "../project/ProjectState.ts";
import { DecryptorProject } from "./project/DecryptorProject.ts";

/**
 * Creates an initial empty project to be displayed on app start.
 *
 * @returns An initial empty project.
 */
function createInitialProject(): DecryptorProject {
    const project = new DecryptorProject();
    project.addInput();
    project.markAsSaved();
    return project;
}

/**
 * The decryptor state holding the current decryptor project.
 */
@Injectable({ providedIn: "root" })
export class DecryptorState extends ProjectState<DecryptorProject> {
    public constructor() {
        super(createInitialProject());
    }
}
