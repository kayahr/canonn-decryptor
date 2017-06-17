/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { OptionComponent } from "./OptionComponent";
import { BooleanOption } from "./converters/options/BooleanOption";

/**
 * Displays a decryptor boolean option.
 */
@Component({
    selector: "decryptor-boolean-option",
    templateUrl: "assets/decryptor/boolean-option.html"
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
