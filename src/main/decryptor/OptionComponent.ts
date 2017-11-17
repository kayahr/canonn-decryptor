/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Input } from "@angular/core";
import { ConverterOption } from "./converters/options/ConverterOption";
import { Converter } from "./converters/Converter";

/**
 * Abstract base class for option components.
 */
export abstract class OptionComponent<T extends ConverterOption> {
    /** The converter option  */
    @Input()
    protected option: T;

    /** The converter. */
    @Input()
    protected converter: Converter;

    /**
     * Returns the option type.
     *
     * @return The option type.
     */
    public get type(): string {
        return this.option.getType();
    }

    /**
     * Returns the option title.
     *
     * @return The option title.
     */
    public get title(): string {
        return this.option.getTitle();
    }

    /**
     * Checks if option is disabled.
     *
     * @return True if disabled, false if not.
     */
    public get disabled(): string | null {
        return this.option.isDisabled(this.converter) ? "disabled" : null;
    }
}
