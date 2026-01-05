/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/number-option.html";
import { LabelDirective } from "../ui/LabelDirective.ts";
import { NoUpdateOnEditDirective } from "../ui/NoUpdateOnEditDirective.ts";
import type { StringValue } from "../ui/StringValue.ts";
import type { NumberOption } from "./converters/options/NumberOption.ts";
import { OptionComponent } from "./OptionComponent.ts";

/**
 * Displays a decryptor string option.
 */
@Component({
    selector: "decryptor-number-option",
    imports: [
        FormsModule,
        NoUpdateOnEditDirective,
        LabelDirective
    ],
    template
})
export class NumberOptionComponent extends OptionComponent<NumberOption> {
    /**
     * Returns the option value.
     *
     * @returns The current option value.
     */
    public get value(): StringValue {
        return this.option.getValue(this.converter).toString();
    }

    /**
     * Sets the option value.
     *
     * @param value  The new option value to set.
     */
    public set value(value: StringValue) {
        this.option.setValue(this.converter, Number(value));
    }

    /**
     * Returns the minimum numeric value of this option.
     *
     * @returns The minimum number.
     */
    public get min(): number {
        return this.option.getMin();
    }

    /**
     * Returns the maximum numeric value of this option.
     *
     * @returns The maximum number.
     */
    public get max(): number {
        return this.option.getMax();
    }

    /**
     * Returns the step size.
     *
     * @returns The step size.
     */
    public get step(): number {
        return this.option.getStep();
    }
}
