/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { NumberOption } from "./converters/options/NumberOption";
import { OptionComponent } from "./OptionComponent";
import { StringValue } from "../ui/StringValue";

/**
 * Displays a decryptor string option.
 */
@Component({
    selector: "decryptor-number-option",
    templateUrl: "assets/decryptor/number-option.html"
})
export class NumberOptionComponent extends OptionComponent<NumberOption> {
    /**
     * Returns the option value.
     *
     * @return The current option value.
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
        this.option.setValue(this.converter, +value);
    }

    /**
     * Returns the minimum numeric value of this option.
     *
     * @return The minimum number.
     */
    public get min(): number {
        return this.option.getMin();
    }

    /**
     * Returns the maximum numeric value of this option.
     *
     * @return The maximum number.
     */
    public get max(): number {
        return this.option.getMax();
    }

    /**
     * Returns the step size.
     *
     * @return The step size.
     */
    public get step(): number {
        return this.option.getStep();
    }
}
