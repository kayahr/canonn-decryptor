/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";

import template from "../../../assets/decryptor/select-option.html";
import { LabelDirective } from "../ui/LabelDirective.ts";
import type { StringValue } from "../ui/StringValue.ts";
import type { SelectItem, SelectOption } from "./converters/options/SelectOption.ts";
import { OptionComponent } from "./OptionComponent.ts";

/**
 * Displays a decryptor select option.
 */
@Component({
    selector: "decryptor-select-option",
    imports: [
        FormsModule,
        LabelDirective
    ],
    template
})
export class SelectOptionComponent extends OptionComponent<SelectOption> {
    /**
     * Returns the current option value.
     *
     * @returns The current option value.
     */
    public readonly value = computed<StringValue>(() => this.getOption().getValue(this.getConverter()));

    /**
     * Sets a new option value.
     *
     * @param value  The new option value to set.
     */
    public setValue(value: StringValue): void {
        this.getOption().setValue(this.getConverter(), value.valueOf());
    }

    /**
     * Returns the selectable items.
     *
     * @returns The selectable items.
     */
    public readonly items = computed<readonly SelectItem[]>(() => this.getOption().getItems());
}
