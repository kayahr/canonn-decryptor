/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Input } from "@angular/core";

import type { Converter } from "./converters/Converter.ts";
import type { ConverterOption } from "./converters/options/ConverterOption.ts";

/**
 * Abstract base class for option components.
 */
export abstract class OptionComponent<T extends ConverterOption> {
    /** The converter option  */
    @Input()
    protected option!: T;

    /** The converter. */
    @Input()
    protected converter!: Converter;

    /**
     * Returns the option type.
     *
     * @returns The option type.
     */
    public get type(): string {
        return this.option.getType();
    }

    /**
     * Returns the option title.
     *
     * @returns The option title.
     */
    public get title(): string {
        return this.option.getTitle();
    }

    /**
     * Checks if option is disabled.
     *
     * @returns True if disabled, false if not.
     */
    public get disabled(): string | null {
        return this.option.isDisabled(this.converter) ? "disabled" : null;
    }
}
