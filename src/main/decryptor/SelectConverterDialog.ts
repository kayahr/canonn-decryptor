/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { Dialog } from "../ui/Dialog";
import { ConverterDescriptor, getConverterDescriptors } from "./converters/Converter";

/**
 * Displays a list of available converters and let the user select one of them.
 */
@Component({
    templateUrl: "assets/decryptor/select-converter-dialog.html"
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
            if (!group) {
                groups.push(group = index[groupId] = []);
            }
            group.push(descriptor);
        }

        return groups;
    }
}
