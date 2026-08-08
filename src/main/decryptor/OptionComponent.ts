/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, Input, computed, signal } from "@angular/core";

import type { Converter } from "./converters/Converter.ts";
import type { ConverterOption } from "./converters/options/ConverterOption.ts";

/**
 * Abstract base class for option components.
 */
@Directive()
export abstract class OptionComponent<T extends ConverterOption> {
    private readonly optionState = signal<T | null>(null);
    private readonly converterState = signal<Converter | null>(null);

    /** The converter option  */
    @Input({ required: true })
    protected set option(option: T) {
        this.optionState.set(option);
    }

    /** The converter. */
    @Input({ required: true })
    protected set converter(converter: Converter) {
        this.converterState.set(converter);
    }

    /** Returns the configured converter option. */
    protected getOption(): T {
        return this.optionState()!;
    }

    /** Returns the configured converter. */
    protected getConverter(): Converter {
        return this.converterState()!;
    }

    /**
     * Returns the option type.
     *
     * @returns The option type.
     */
    public readonly type = computed(() => this.getOption().getType());

    /**
     * Returns the option title.
     *
     * @returns The option title.
     */
    public readonly title = computed(() => this.getOption().getTitle());

    /**
     * Checks if option is disabled.
     *
     * @returns True if disabled, false if not.
     */
    public readonly disabled = computed(() => this.getOption().isDisabled(this.getConverter()));
}
