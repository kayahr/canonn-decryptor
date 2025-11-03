/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Converter } from "../Converter.ts";
import { ConverterOption, type ConverterOptionArgs, type OptionTarget, converterOption } from "./ConverterOption.ts";

/**
 * The arguments of a boolean option.
 */
export interface BooleanOptionArgs<T extends Converter> extends ConverterOptionArgs<boolean, T> {}

/**
 * Property decorator for a boolean option.
 *
 * @param id    - The option ID.
 * @param title - The option title.
 * @param args  - Optional option arguments.
 */
export function booleanOption<T extends Converter>(id: string, title: string, args: BooleanOptionArgs<T> = {}):
        (target: OptionTarget<T>, propertyKey: string) => void {
    return function (target: OptionTarget<T>, propertyKey: string): void {
        converterOption(target, propertyKey, new BooleanOption<T>(id, title, args));
    };
}

/**
 * Boolean option.
 */
export class BooleanOption<T extends Converter = Converter> extends ConverterOption<boolean, T> {
    public constructor(id: string, title: string, args: BooleanOptionArgs<T>) {
        super("boolean", id, title, args.defaultValue ?? false, args);
    }
}
