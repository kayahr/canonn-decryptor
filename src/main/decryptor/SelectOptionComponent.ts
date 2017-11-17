/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";
import { OptionComponent } from "./OptionComponent";
import { StringValue } from "../ui/StringValue";
import { SelectOption, SelectItem } from "./converters/options/SelectOption";

/**
 * Displays a decryptor select option.
 */
@Component({
    selector: "decryptor-select-option",
    templateUrl: "assets/decryptor/select-option.html"
})
export class SelectOptionComponent extends OptionComponent<SelectOption> {
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
     * Returns the selectable items.
     *
     * @return The selectable items.
     */
    public get items(): ReadonlyArray<SelectItem> {
        return this.option.getItems();
    }
}
