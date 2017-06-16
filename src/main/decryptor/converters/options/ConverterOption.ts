/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for target object which holds the converter options.
 */
export interface OptionTarget {
    options: ConverterOption<any>[];
}

/**
 * Base interface for convert option arguments.
 */
export interface ConverterOptionArgs<T> {
    defaultValue?: T;
    onChange?: () => void;
}

/**
 * Base function called by all option property decorators.
 */
export function converterOption<T>(target: OptionTarget, propertyKey: string, option: ConverterOption<T>): void {
    if (!target.options) {
        target.options = [];
    }
    target.options.push(option);
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: true,
        get: function (this: any): T {
            return option.getValue(this);
        },
        set: function (this: any, value: T): void {
            option.setValue(this, value);
        }
    });
}

/**
 * Abstract base class for converter options.
 */
export abstract class ConverterOption<T> {
    private symbol = Symbol();
    private readonly type: string;
    private id: string;
    private readonly title: string;
    protected defaultValue: T;
    private onChange: (() => void) | null;

    public constructor(type: string, id: string, title: string, defaultValue: T, args: ConverterOptionArgs<T>) {
        this.type = type;
        this.id = id;
        this.title = title;
        this.defaultValue = defaultValue;
        this.onChange = args.onChange || null;
    }

    /**
     * Returns the option ID.
     *
     * @return The option ID.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Returns the option type.
     *
     * @return The option type.
     */
    public getType(): string {
        return this.type;
    }

    /**
     * Returns the option title.
     *
     * @return The option title.
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Returns the default value of this option.
     *
     * @return The default value.
     */
    public getDefaultValue(): T {
        return this.defaultValue;
    }

    /**
     * Corrects the given value and returns the corrected value. Default implementation simply returns the value
     * unchanged but converter option implementations may implement a real value correction here.
     *
     * @param value  The value to correct.
     * @return The corrected value.
     */
    protected correctValue(value: T): T {
        return value;
    }

    /**
     * Sets a new option value.
     *
     * @param object  The object on which to set the option.
     * @param value   The option value to set.
     */
    public setValue(object: any, value: T): void {
        const clamped = this.correctValue(value);
        if (clamped !== object[this.symbol]) {
            object[this.symbol] = clamped;
            if (this.onChange) {
                this.onChange.call(object);
            }
        }
    }

    /**
     * Returns the option value.
     *
     * @param object  The object from which to read the option value.
     * @return the option value.
     */
    public getValue(object: any): T {
        const value = object[this.symbol];
        return value != null ? value : this.defaultValue;
    }
}
