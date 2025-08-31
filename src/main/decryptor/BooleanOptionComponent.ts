/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/boolean-option.html?raw";
import { CustomCheckboxDirective } from "../ui/CustomCheckboxDirective.js";
import { LabelDirective } from "../ui/LabelDirective.js";
import { BooleanOption } from "./converters/options/BooleanOption.js";
import { OptionComponent } from "./OptionComponent.js";
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
     * @return The current option value.
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
