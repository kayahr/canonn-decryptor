/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";

import template from "../../../assets/decryptor/select-converter-dialog.html";
import { ButtonDirective } from "../ui/ButtonDirective.ts";
import { Dialog } from "../ui/Dialog.ts";
import { DialogComponent } from "../ui/DialogComponent.ts";
import { type ConverterDescriptor, getConverterDescriptors } from "./converters/Converter.ts";

/**
 * Displays a list of available converters and let the user select one of them.
 */
@Component({
    imports: [
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class SelectConverterDialog extends Dialog<string> {
    /**
     * Returns the converter groups to be listed in the dialog.
     *
     * @returns The converter groups.
     */
    public get converterGroups(): ConverterDescriptor[][] {
        const groups: ConverterDescriptor[][] = [];
        const index: Record<string, ConverterDescriptor[]> = {};

        for (const descriptor of getConverterDescriptors()) {
            const groupId = descriptor.getGroupId();
            let group = index[groupId];
            if (group == null) {
                groups.push(group = index[groupId] = []);
            }
            group.push(descriptor);
        }

        return groups;
    }
}
