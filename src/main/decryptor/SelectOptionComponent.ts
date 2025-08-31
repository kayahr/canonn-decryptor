/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/select-option.html?raw";
import { LabelDirective } from "../ui/LabelDirective.js";
import { NoUpdateOnEditDirective } from "../ui/NoUpdateOnEditDirective.js";
import { type StringValue } from "../ui/StringValue.js";
import { type SelectItem, SelectOption } from "./converters/options/SelectOption.js";
import { OptionComponent } from "./OptionComponent.js";

/**
 * Displays a decryptor select option.
 */
@Component({
    selector: "decryptor-select-option",
    imports: [
        CommonModule,
        FormsModule,
        NoUpdateOnEditDirective,
        LabelDirective
    ],
    template
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
    public get items(): readonly SelectItem[] {
        return this.option.getItems();
    }
}
