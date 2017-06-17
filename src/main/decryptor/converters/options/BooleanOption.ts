/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption, OptionTarget, converterOption, ConverterOptionArgs } from "./ConverterOption";

/**
 * The arguments of a boolean option.
 */
export interface BooleanOptionArgs extends ConverterOptionArgs<boolean> {}

/**
 * Property decorator for a boolean option.
 *
 * @param id     The option ID.
 * @param title  The option title.
 * @param args   Optional option arguments.
 */
export function booleanOption(id: string, title: string, args: BooleanOptionArgs = {}):
        PropertyDecorator {
    return function (target: OptionTarget, propertyKey: string): void {
        converterOption(target, propertyKey, new BooleanOption(id, title, args));
    };
}

/**
 * Boolean option.
 */
export class BooleanOption extends ConverterOption<boolean> {
    public constructor(id: string, title: string, args: BooleanOptionArgs) {
        super("boolean", id, title, args.defaultValue != null ? args.defaultValue : false, args);
    }
}
