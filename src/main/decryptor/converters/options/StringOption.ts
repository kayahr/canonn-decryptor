/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption, OptionTarget, converterOption, ConverterOptionArgs } from "./ConverterOption";

/**
 * The string option arguments.
 */
export interface StringOptionArgs extends ConverterOptionArgs<string> {
    // No additional arguments
}

/**
 * Property decorator for a string option.
 *
 * @param id     The option ID.
 * @param title  The option title.
 * @param args   Optional option arguments.
 */
export function stringOption(id: string, title: string, args: StringOptionArgs = {}): PropertyDecorator {
    return function (target: OptionTarget, propertyKey: string): void {
        converterOption(target, propertyKey, new StringOption(id, title, args));
    };
}

/**
 * String option.
 */
export class StringOption extends ConverterOption<string> {
    public constructor(id: string, title: string, args: StringOptionArgs) {
        super("string", id, title, args.defaultValue != null ? args.defaultValue : "", args);
    }
}
