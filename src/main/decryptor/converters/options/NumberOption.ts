/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption, OptionTarget, converterOption, ConverterOptionArgs } from "./ConverterOption";
import { Converter } from "../Converter";

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
 * @param id     The option ID.
 * @param title  The option title.
 * @param args   Optional option arguments.
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
    private min: number;
    private max: number;
    private step: number;

    public constructor(id: string, title: string, args: NumberOptionArgs<T>) {
        super("number", id, title, args.defaultValue != null ? args.defaultValue : 0, args);
        this.max = args.max != null ? args.max : Number.MAX_SAFE_INTEGER;
        this.min = args.min != null ? args.min : 0;
        this.step = args.step != null ? args.step : 1;
    }

    /**
     * Returns the maximum value.
     *
     * @return The maximum value.
     */
    public getMax(): number {
        return this.max;
    }

    /**
     * Returns the minimum value.
     *
     * @return The minimum value.
     */
    public getMin(): number {
        return this.min;
    }

    /**
     * Returns the step size.
     *
     * @return The step size.
     */
    public getStep(): number {
        return this.step;
    }

    /** @inheritDoc */
    protected correctValue(value: number): number {
        const { min, max, step } = this;
        return Math.min(max, (Math.round((Math.max(value, min) - min) / step)) * step + min);
    }
}
