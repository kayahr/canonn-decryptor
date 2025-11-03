/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Converter } from "../Converter.ts";
import { ConverterOption, type ConverterOptionArgs, type OptionTarget, converterOption } from "./ConverterOption.ts";

/**
 * The arguments of a number option.
 */
export interface NumberOptionArgs<T extends Converter> extends ConverterOptionArgs<number, T> {
    min?: number;
    max?: number;
    step?: number;
}

/**
 * Property decorator for a number option.
 *
 * @param id    - The option ID.
 * @param title - The option title.
 * @param args  - Optional option arguments.
 */
export function numberOption<T extends Converter>(id: string, title: string,
        args: NumberOptionArgs<T> = {}): (target: OptionTarget<T>, propertyKey: string) => void {
    return function (target: OptionTarget<T>, propertyKey: string): void {
        converterOption(target, propertyKey, new NumberOption<T>(id, title, args));
    };
}

/**
 * Number option.
 */
export class NumberOption<T extends Converter = Converter> extends ConverterOption<number, T> {
    private readonly min: number;
    private readonly max: number;
    private readonly step: number;

    public constructor(id: string, title: string, args: NumberOptionArgs<T>) {
        super("number", id, title, args.defaultValue ?? 0, args);
        this.max = args.max ?? 65535;
        this.min = args.min ?? -65535;
        this.step = args.step ?? 1;
    }

    /**
     * Returns the maximum value.
     *
     * @returns The maximum value.
     */
    public getMax(): number {
        return this.max;
    }

    /**
     * Returns the minimum value.
     *
     * @returns The minimum value.
     */
    public getMin(): number {
        return this.min;
    }

    /**
     * Returns the step size.
     *
     * @returns The step size.
     */
    public getStep(): number {
        return this.step;
    }

    /** @inheritdoc */
    protected override correctValue(value: number): number {
        const { min, max, step } = this;
        return Math.min(max, (Math.round((Math.max(value, min) - min) / step)) * step + min);
    }
}
