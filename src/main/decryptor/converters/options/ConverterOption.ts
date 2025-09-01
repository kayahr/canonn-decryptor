/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for target object which holds the converter options.
 */
import { Converter } from "../Converter.js";

export interface OptionTarget<C extends Converter> {
    options?: Array<ConverterOption<unknown, C>> | null;
}

/**
 * Base interface for convert option arguments.
 */
export interface ConverterOptionArgs<T, C extends Converter> {
    defaultValue?: T;
    sortIndex?: number;
    onChange?: (converter: C) => void;
    disabled?: (converter: C) => boolean;
}

/**
 * Base function called by all option property decorators.
 */
export function converterOption<T, C extends Converter>(target: OptionTarget<C>, propertyKey: string, option: ConverterOption<T, C>): void {
    const options = target.options = target.options != null ? target.options.slice() : [];
    options.push(option);
    options.sort((a, b) => a.getSortIndex() - b.getSortIndex());
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: true,
        get: function (this: Converter): T {
            return option.getValue((this as C));
        },
        set: function (this: Converter, value: T): void {
            option.setValue((this as C), value);
        }
    });
}

/**
 * Abstract base class for converter options.
 */
export abstract class ConverterOption<T = string | number | boolean, C extends Converter = Converter> {
    private readonly type: string;
    private readonly id: string;
    private readonly title: string;
    private readonly sortIndex: number;
    protected readonly defaultValue: T;
    private readonly onChange: ((converter: C) => void) | null;
    private readonly disabled: ((converter: C) => boolean) | null;

    public constructor(type: string, id: string, title: string, defaultValue: T, args: ConverterOptionArgs<T, C>) {
        this.type = type;
        this.id = id;
        this.title = title;
        this.defaultValue = defaultValue;
        this.onChange = args.onChange ?? null;
        this.disabled = args.disabled ?? null;
        this.sortIndex = args.sortIndex ?? 0;
    }

    /**
     * Returns the option ID.
     *
     * @returns The option ID.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Returns the option type.
     *
     * @returns The option type.
     */
    public getType(): string {
        return this.type;
    }

    /**
     * Returns the sort index.
     *
     * @returns the sort index.
     */
    public getSortIndex(): number {
        return this.sortIndex;
    }

    /**
     * Returns the option title.
     *
     * @returns The option title.
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Returns the default value of this option.
     *
     * @returns The default value.
     */
    public getDefaultValue(): T {
        return this.defaultValue;
    }

    /**
     * Checks if this option is currently disabled.
     *
     * @param converter - The converter the option is connected to.
     * @returns True if disabled, false if not.
     */
    public isDisabled(converter: C): boolean {
        return (this.disabled != null) ? this.disabled(converter) : false;
    }

    /**
     * Corrects the given value and returns the corrected value. Default implementation simply returns the value
     * unchanged but converter option implementations may implement a real value correction here.
     *
     * @param value - The value to correct.
     * @returns The corrected value.
     */
    protected correctValue(value: T): T {
        return value;
    }

    /**
     * Sets a new option value.
     *
     * @param converter - The converter on which to set the option value.
     * @param value     - The option value to set.
     */
    public setValue(converter: C, value: T): void {
        converter.setOptionValue(this, this.correctValue(value), this.onChange);
    }

    /**
     * Returns the option value.
     *
     * @param converter - The converter from which to read the option value.
     * @returns the option value.
     */
    public getValue(converter: C): T {
        const value = converter.getOptionValue(this);
        return value ?? this.defaultValue;
    }
}
