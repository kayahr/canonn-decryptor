/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption, OptionTarget, converterOption, ConverterOptionArgs } from "./ConverterOption";
import { Converter } from "../Converter";
import { IllegalArgumentError } from "../../../utils/error";

/**
 * The select option arguments.
 */
export interface SelectOptionArgs<T extends Converter> extends ConverterOptionArgs<string, T> {}

export type SelectItem = {
    readonly value: string;
    readonly label: string;
};

export type SelectItems = SelectItem[];

/**
 * Property decorator for a selector option.
 *
 * @param id     The option ID.
 * @param title  The option title.
 * @param items  The selectable items.
 * @param args   Optional option arguments.
 */
export function selectOption<T extends Converter>(id: string, title: string, items: SelectItems,
        args: SelectOptionArgs<T> = {}): (target: OptionTarget<T>, propertyKey: string) => void {
    return function (target: OptionTarget<T>, propertyKey: string): void {
        converterOption(target, propertyKey, new SelectOption(id, title, items, args));
    };
}

/**
 * Select option.
 */
export class SelectOption<T extends Converter = Converter> extends ConverterOption<string, T> {
    /** The selectable items. */
    private readonly items: SelectItems;

    public constructor(id: string, title: string, items: SelectItems, args: SelectOptionArgs<T>) {
        super("select", id, title, args.defaultValue != null ? args.defaultValue : "", args);
        if (items.length < 1) {
            throw new IllegalArgumentError("There must be at least one item to select");
        }
        this.items = items;
    }

    /**
     * Returns the selectable items.
     *
     * @return The selectable items.
     */
    public getItems(): ReadonlyArray<SelectItem> {
        return this.items;
    }

    /** @inheritDoc */
    protected correctValue(value: string): string {
        for (const item of this.items) {
            if (value === item.value) {
                return value;
            }
        }
        return this.items[0].value;
    }
}
