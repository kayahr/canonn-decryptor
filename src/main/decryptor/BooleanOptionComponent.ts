/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/boolean-option.html";
import { CustomCheckboxDirective } from "../ui/CustomCheckboxDirective.ts";
import { LabelDirective } from "../ui/LabelDirective.ts";
import type { BooleanOption } from "./converters/options/BooleanOption.ts";
import { OptionComponent } from "./OptionComponent.ts";
/**
 * Displays a decryptor boolean option.
 */
@Component({
    selector: "decryptor-boolean-option",
    imports: [
        FormsModule,
        LabelDirective,
        CustomCheckboxDirective
    ],
    template
})
export class BooleanOptionComponent extends OptionComponent<BooleanOption> {
    /**
     * Returns the option value.
     *
     * @returns The current option value.
     */
    public get value(): boolean {
        return this.option.getValue(this.converter);
    }

    /**
     * Sets the option value.
     *
     * @param value  The new option value to set.
     */
    public set value(value: boolean) {
        this.option.setValue(this.converter, value);
    }
}
