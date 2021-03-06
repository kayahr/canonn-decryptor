/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption, OptionTarget, converterOption, ConverterOptionArgs } from "./ConverterOption";
import { Converter } from "../Converter";

/**
 * The string option arguments.
 */
export interface StringOptionArgs<T extends Converter> extends ConverterOptionArgs<string, T> {
    allowEmpty?: boolean;
    maxLength?: number;
}

/**
 * Property decorator for a string option.
 *
 * @param id     The option ID.
 * @param title  The option title.
 * @param args   Optional option arguments.
 */
export function stringOption<T extends Converter>(id: string, title: string, args: StringOptionArgs<T> = {}):
        (target: OptionTarget<T>, propertyKey: string) => void {
    return function (target: OptionTarget<T>, propertyKey: string): void {
        converterOption(target, propertyKey, new StringOption(id, title, args));
    };
}

/**
 * String option.
 */
export class StringOption<T extends Converter = Converter> extends ConverterOption<string, T> {
    private allowEmpty: boolean;
    private maxLength: number | null;

    public constructor(id: string, title: string, args: StringOptionArgs<T>) {
        super("string", id, title, args.defaultValue != null ? args.defaultValue : "", args);
        this.allowEmpty = args.allowEmpty || true;
        this.maxLength = args.maxLength || null;
    }

    /**
     * Checks if value is allowed to be empty.
     *
     * @return True if value can be empty, false if not.
     */
    public isAllowEmpty(): boolean {
        return this.allowEmpty;
    }

    /**
     * Returns the maximum string length or null when unlimited.
     *
     * @return The maximum string length or null when unlimited.
     */
    public getMaxLength(): number | null {
        return this.maxLength;
    }

    /** @inheritDoc */
    protected correctValue(value: string): string {
        const { allowEmpty, maxLength, defaultValue } = this;
        if (!allowEmpty && value === "") {
            value = defaultValue || " ";
        }
        if (maxLength) {
            value = value.substring(0, maxLength);
        }
        return value;
    }
}
