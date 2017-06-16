/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { OptionComponent } from "./OptionComponent";
import { StringOption } from "./converters/options/StringOption";
import { StringValue } from "../ui/StringValue";

/**
 * Displays a decryptor string option.
 */
@Component({
    selector: "decryptor-string-option",
    templateUrl: "assets/decryptor/string-option.html"
})
export class StringOptionComponent extends OptionComponent<StringOption> {
    /**
     * Returns the current option value.
     *
     * @return The current option value.
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
     * @return The maximum string length.
     */
    public get maxLength(): number | null {
        return this.option.getMaxLength();
    }
}
