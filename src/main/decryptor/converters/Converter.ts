/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentError } from "../../utils/error.js";
import { Signal } from "../../utils/Signal.js";
import { ConverterOption } from "./options/ConverterOption.js";

/** Information about registered converters. */
const descriptors: ConverterDescriptor[] = [];

/** Map from converter ID to converter descriptor. */
const idMap: { [id: string]: ConverterDescriptor } = {};

/** Map from converter to converter descriptor. */
const ctorMap = new WeakMap<new () => Converter, ConverterDescriptor>();

/**
 * Returns the descriptors of all registered converters.
 *
 * @returns The descriptors of all registered converters.
 */
export function getConverterDescriptors(): readonly ConverterDescriptor[] {
    return descriptors;
}

/**
 * Returns the converter descriptor with the given ID.
 *
 * @param id - The converter ID.
 * @returns The converter descriptor.
 * @throws IllegalArgumentError  When no matching converter descriptor was found.
 */
export function getConverterDescriptor<T extends Converter>(id: string): ConverterDescriptor<T>;

/**
 * Returns the converter descriptor for the given converter class.
 *
 * @param ctor - The converter class.
 * @returns The converter descriptor.
 * @throws IllegalArgumentError  When no matching converter descriptor was found.
 */
export function getConverterDescriptor<T extends Converter>(ctor: new () => T): ConverterDescriptor<T>;

export function getConverterDescriptor<T extends Converter>(arg: string | (new () => T)): ConverterDescriptor<T> {
    const info = typeof arg === "string" ? idMap[arg] : ctorMap.get(arg);
    if (info == null) {
        throw new IllegalArgumentError(`Converter descriptor for '${arg}' not found`);
    }
    return info as ConverterDescriptor<T>;
}

/**
 * Creates and returns a new converter with the given ID.
 *
 * @param id - The converter ID.
 * @returns The created converter.
 */
export function createConverter(id: string): Converter {
    return getConverterDescriptor(id).create();
}

/**
 * Class decorator for converter implementations.
 *
 * @param id    - The converter ID.
 * @param title - The converter title.
 * @param description - The converter description.
 */
export function converter<T extends Converter>(id: string, groupId: string, title: string, description: string):
        <C extends new () => T>(ctor: C) => C {
    return function <T extends Converter, C extends new () => T>(ctor: C): C {
        const info = new ConverterDescriptor(ctor, id, groupId, title, description);
        descriptors.push(info);
        descriptors.sort((a, b) => a.getId().localeCompare(b.getId()));
        idMap[id] = info;
        ctorMap.set(ctor, info);
        return ctor;
    };
}

/**
 * Describes a converter.
 */
export class ConverterDescriptor<T extends Converter = Converter> {
    private readonly ctor: new () => T;
    private readonly id: string;
    private readonly groupId: string;
    private readonly title: string;
    private readonly description: string;

    public constructor(ctor: new () => T, id: string, groupId: string, title: string, description: string) {
        this.ctor = ctor;
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.description = description;
    }

    /**
     * Returns the converter ID.
     *
     * @returns The converter ID.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Returns the converter group ID.
     *
     * @returns The converter group ID.
     */
    public getGroupId(): string {
        return this.groupId;
    }

    /**
     * Returns the converter title.
     *
     * @returns The converter title.
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Returns the converter description.
     *
     * @returns The converter description.
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * Creates a new instance of this converter.
     *
     * @returns The created converter.
     */
    public create(): T {
        return new this.ctor();
    }
}

/**
 * JSON structure of a serialized converter.
 */
export interface ConverterJSON {
    type: string;
    options?: { [ name: string ]: unknown };
}

/** Allowed primitive values for converter options. */
export type OptionPrimitive = string | number | boolean;

/**
 * The converter options extracted from the given converter.
 */
export type ConverterOptions<T> = {
    [K in keyof T as T[K] extends OptionPrimitive ? K : never]?: T[K];
};

/**
 * Abstract base class for converters.
 */
export abstract class Converter<T = unknown> {
    private readonly emitOnChanged = Signal.createEmitter<this>();

    /**
     * Emitted when converter has been changed so output must be updated.
     *
     * @event
     */
    public readonly onChanged: Signal<this> = this.emitOnChanged.signal;

    /** The current option values of this converter. */
    private readonly optionValues: WeakMap<ConverterOption<unknown, this>, unknown> = new WeakMap();

    /** The options of this converter. */
    public readonly options?: Array<ConverterOption<string | number | boolean, this>>;

    /** The converter descriptor. */
    private readonly descriptor: ConverterDescriptor<this>;

    public constructor(options?: ConverterOptions<T>) {
        this.descriptor = getConverterDescriptor((this.constructor as new () => this));
        if (options != null) {
            for (const [ name, value ] of Object.entries(options)) {
                this.getOption(name).setValue(this, value);
            }
        }
    }

    public static fromJSON<T extends Converter>(json: ConverterJSON): T {
        // Workaround to load old project with one-time pad cipher which is the same as Vigenere
        if (json.type.startsWith("one-time-pad-")) {
            json.type = "vigenere-" + json.type.substring(13);
            if (json.options?.pad != null) {
                json.options.keyword = json.options.pad;
                delete json.options.pad;
            }
        }

        const converter = getConverterDescriptor(json.type).create();
        if (json.options != null) {
            for (const optionName of Object.keys(json.options)) {
                const optionValue = json.options[optionName];
                converter.getOption(optionName).setValue(converter, optionValue);
            }
        }
        return converter as T;
    }

    /** @inheritDoc */
    public toJSON(): ConverterJSON {
        const json: ConverterJSON = {
            type: this.getType()
        };
        const options = this.getOptions().reduce((options, option) => {
            const value = option.getValue(this);
            if (value !== option.getDefaultValue()) {
                options[option.getId()] = option.getValue(this);
            }
            return options;
        }, ({} as { [ name: string ]: unknown }));
        if (Object.keys(options).length > 0) {
            json.options = options;
        }
        return json;
    }

    /**
     * Converts the given input.
     *
     * @param input - The input to convert.
     * @returns The converted output.
     */
    public abstract convert(input: string): string;

    /**
     * Returns ths converter options.
     *
     * @returns The converter options.
     */
    public getOptions(): ReadonlyArray<ConverterOption<string | number | boolean, this>> {
        return this.options ?? [];
    }

    /**
     * Returns the converter option with the given ID:
     *
     * @param id - The converter option ID.
     * @returns The converter option.
     * @throws IllegalArgumentError  When no option with the given ID exists.
     */
    public getOption(id: string): ConverterOption<any, this> {
        for (const option of this.getOptions()) {
            if (id === option.getId()) {
                return option;
            }
        }
        throw new IllegalArgumentError("Option not found: " + id);
    }

    /**
     * Returns the converter type.
     *
     * @returns The converter type.
     */
    public getType(): string {
        return this.descriptor.getId();
    }

    /**
     * Returns the converter title.
     *
     * @returns The converter title.
     */
    public getTitle(): string {
        return this.descriptor.getTitle();
    }

    /**
     * Returns the converter description.
     *
     * @returns The converter description.
     */
    public getDescription(): string {
        return this.descriptor.getDescription();
    }

    /**
     * Returns the option value of the specified option.
     *
     * @param option - The converter option.
     * @returns The option value or null if none.
     */
    public getOptionValue<T>(option: ConverterOption<T, this>): T | null {
        const value = this.optionValues.get(option);
        return value === undefined ? null : value as T;
    }

    /**
     * Sets (or removes) an option value.
     *
     * @param option - The converter option.
     * @param value  - The option value to set. Null to remove the value.
     * @returns True if value was changed, false if not.
     */
    public setOptionValue<T>(option: ConverterOption<T, this>, value: T,
            onChange: ((converter: this) => void) | null = null): void {
        const oldValue = this.getOptionValue(option);
        if (value !== oldValue) {
            if (value == null) {
                this.optionValues.delete(option);
            } else {
                this.optionValues.set(option, value);
            }
            if (onChange != null) {
                onChange(this);
            }
            this.emitOnChanged(this);
        }
    }
}
