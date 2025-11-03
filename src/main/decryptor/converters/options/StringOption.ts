/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Converter } from "../Converter.ts";
import { ConverterOption, type ConverterOptionArgs, type OptionTarget, converterOption } from "./ConverterOption.ts";

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
 * @param id    - The option ID.
 * @param title - The option title.
 * @param args  - Optional option arguments.
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
    private readonly allowEmpty: boolean;
    private readonly maxLength: number | null;

    public constructor(id: string, title: string, args: StringOptionArgs<T>) {
        super("string", id, title, args.defaultValue ?? "", args);
        this.allowEmpty = (args.allowEmpty ?? false) || true;
        this.maxLength = args.maxLength ?? null;
    }

    /**
     * Checks if value is allowed to be empty.
     *
     * @returns True if value can be empty, false if not.
     */
    public isAllowEmpty(): boolean {
        return this.allowEmpty;
    }

    /**
     * Returns the maximum string length or null when unlimited.
     *
     * @returns The maximum string length or null when unlimited.
     */
    public getMaxLength(): number | null {
        return this.maxLength;
    }

    /** @inheritdoc */
    protected override correctValue(value: string): string {
        const { allowEmpty, maxLength, defaultValue } = this;
        if (!allowEmpty && value === "") {
            value = defaultValue === "" ? " " : defaultValue;
        }
        if (maxLength != null) {
            value = value.substring(0, maxLength);
        }
        return value;
    }
}
