/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component, computed } from "@angular/core";
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
     * Returns the maximum string length.
     *
     * @returns The maximum string length.
     */
    public readonly maxLength = computed(() => this.getOption().getMaxLength());
}
