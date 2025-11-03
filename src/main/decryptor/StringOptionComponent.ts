/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/string-option.html";
import { LabelDirective } from "../ui/LabelDirective.ts";
import { NoUpdateOnEditDirective } from "../ui/NoUpdateOnEditDirective.ts";
import type { StringValue } from "../ui/StringValue.ts";
import type { StringOption } from "./converters/options/StringOption.ts";
import { OptionComponent } from "./OptionComponent.ts";

/**
 * Displays a decryptor string option.
 */
@Component({
    selector: "decryptor-string-option",
    imports: [
        FormsModule,
        NoUpdateOnEditDirective,
        LabelDirective
    ],
    template
})
export class StringOptionComponent extends OptionComponent<StringOption> {
    /**
     * Returns the current option value.
     *
     * @returns The current option value.
     */
    public get value(): StringValue {
        return this.option.getValue(this.converter);
    }

    /**
     * Sets a new option value.
     *
     * @param value  The new option value to set.
     */
    public set value(value: StringValue) {
        this.option.setValue(this.converter, value.valueOf());
    }

    /**
     * Returns the maximum string length.
     *
     * @returns The maximum string length.
     */
    public get maxLength(): number | null {
        return this.option.getMaxLength();
    }
}
