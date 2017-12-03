/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ConverterOption } from "./options/ConverterOption";
import { IllegalArgumentError } from "../../utils/error";
import { Signal } from "../../utils/Signal";

/** Information about registered converters. */
const descriptors: ConverterDescriptor[] = [];

/** Map from converter ID to converter descriptor. */
const idMap: { [id: string]: ConverterDescriptor } = {};

/** Map from converter to converter descriptor. */
const ctorMap = new WeakMap<new () => Converter, ConverterDescriptor>();

/**
 * Returns the descriptors of all registered converters.
 *
 * @return The descriptors of all registered converters.
 */
export function getConverterDescriptors(): ReadonlyArray<ConverterDescriptor> {
    return descriptors;
}

/**
 * Returns the converter descriptor with the given ID.
 *
 * @param id  The converter ID.
 * @return The converter descriptor.
 * @throws IllegalArgumentError  When no matching converter descriptor was found.
 */
export function getConverterDescriptor<T extends Converter>(id: string): ConverterDescriptor<T>;

/**
 * Returns the converter descriptor for the given converter class.
 *
 * @param ctor  The converter class.
 * @return The converter descriptor.
 * @throws IllegalArgumentError  When no matching converter descriptor was found.
 */
export function getConverterDescriptor<T extends Converter>(ctor: new () => T): ConverterDescriptor<T>;

export function getConverterDescriptor<T extends Converter>(arg: string | (new () => T)): ConverterDescriptor<T> {
    const info = typeof arg === "string" ? idMap[arg] : ctorMap.get(arg);
    if (!info) {
        throw new IllegalArgumentError(`Converter descriptor for '${arg}' not found`);
    }
    return <ConverterDescriptor<T>>info;
}

/**
 * Creates and returns a new converter with the given ID.
 *
 * @param id  The converter ID.
 * @return The created converter.
 */
export function createConverter(id: string): Converter {
    return getConverterDescriptor(id).create();
}

/**
 * Class decorator for converter implementations.
 *
 * @param id           The converter ID.
 * @param title        The converter title.
 * @param description  The converter description.
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
     * @return The converter ID.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Returns the converter group ID.
     *
     * @return The converter group ID.
     */
    public getGroupId(): string {
        return this.groupId;
    }

    /**
     * Returns the converter title.
     *
     * @return The converter title.
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Returns the converter description.
     *
     * @return The converter description.
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * Creates a new instance of this converter.
     *
     * @return The created converter.
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
    options?: { [ name: string ]: any };
}

/**
 * Abstract base class for converters.
 */
export abstract class Converter {
    private emitOnChanged = Signal.createEmitter<this>();

    /**
     * Emitted when converter has been changed so output must be updated.
     *
     * @event
     */
    public readonly onChanged: Signal<this> = this.emitOnChanged.signal;

    /** The current option values of this converter. */
    private readonly optionValues: WeakMap<ConverterOption<any, this>, any> = new WeakMap();

    /** The options of this converter. */
    public readonly options: ConverterOption<any, this>[];

    /** The converter descriptor. */
    private readonly descriptor: ConverterDescriptor<this>;

    public constructor() {
        this.descriptor = getConverterDescriptor(<new () => this>this.constructor);
    }

    public static fromJSON<T extends Converter>(json: ConverterJSON): T {
        const converter = getConverterDescriptor(json.type).create();
        if (json.options) {
            for (const optionName of Object.keys(json.options)) {
                const optionValue = json.options[optionName];
                converter.getOption(optionName).setValue(converter, optionValue);
            }
        }
        return <T>converter;
    }

    /** @inheritDoc */
    public toJSON(): ConverterJSON {
        const json: ConverterJSON = {
            type: this.getType()
        };
        const options = this.getOptions().reduce((options , option) => {
            const value = option.getValue(this);
            if (value !== option.getDefaultValue()) {
                options[option.getId()] = option.getValue(this);
            }
            return options;
        }, <{ [ name: string ]: any}>{});
        if (Object.keys(options).length > 0) {
            json.options = options;
        }
        return json;
    }

    /**
     * Converts the given input.
     *
     * @param input  The input to convert.
     * @return The converted output.
     */
    public abstract convert(input: string): string;

    /**
     * Returns ths converter options.
     *
     * @return The converter options.
     */
    public getOptions(): ReadonlyArray<ConverterOption<any, this>> {
        return this.options || [];
    }

    /**
     * Returns the converter option with the given ID:
     *
     * @param id  The converter option ID.
     * @return The converter option.
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
     * @return The converter type.
     */
    public getType(): string {
        return this.descriptor.getId();
    }

    /**
     * Returns the converter title.
     *
     * @return The converter title.
     */
    public getTitle(): string {
        return this.descriptor.getTitle();
    }

    /**
     * Returns the converter description.
     *
     * @return The converter description.
     */
    public getDescription(): string {
        return this.descriptor.getDescription();
    }

    /**
     * Returns the option value of the specified option.
     *
     * @param option  The converter option.
     * @return The option value or null if none.
     */
    public getOptionValue<T>(option: ConverterOption<T, this>): T | null {
        const value = this.optionValues.get(option);
        return value === undefined ? null : value;
    }

    /**
     * Sets (or removes) an option value.
     *
     * @param option  The converter option.
     * @param value   The option value to set. Null to remove the value.
     * @return True if value was changed, false if not.
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
            if (onChange) {
                onChange(this);
            }
            this.emitOnChanged(this);
        }
    }
}
