/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import template from "../../../assets/decryptor/select-converter-dialog.html?raw";
import { ButtonDirective } from "../ui/ButtonDirective.js";
import { Dialog } from "../ui/Dialog.js";
import { DialogComponent } from "../ui/DialogComponent.js";
import { ConverterDescriptor, getConverterDescriptors } from "./converters/Converter.js";

/**
 * Displays a list of available converters and let the user select one of them.
 */
@Component({
    imports: [
        CommonModule,
        ButtonDirective,
        DialogComponent
    ],
    template
})
export class SelectConverterDialog extends Dialog<string> {
    /**
     * Returns the converter groups to be listed in the dialog.
     *
     * @return The converter groups.
     */
    public get converterGroups(): ConverterDescriptor[][] {
        const groups: ConverterDescriptor[][] = [];
        const index: { [groupId: string]: ConverterDescriptor[] } = {};

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
