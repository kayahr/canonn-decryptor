/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Converter, converter } from "./Converter.js";
import { numberOption } from "./options/NumberOption.js";

/**
 * Number decoder.
 */
@converter<NumberDecoder>("number-decoder", "number", "Number Decoder",
    "Decodes numbers into ASCII characters. Supports base 2 to 36 and value shifting.")
export class NumberDecoder extends Converter {
    /** Cached regular expression to match a number. */
    private numberRegExp: RegExp | null = null;

    /** Cached regular expression to match a group of numbers. */
    private groupRegExp: RegExp | null = null;

    /** The number base. */
    @numberOption<NumberDecoder>("base", "Base", {
        min: 2,
        max: 36,
        defaultValue: 10,
        onChange: decoder => decoder.resetCaches()
    })
    private base: number = 10;

    /** The number shift.. */
    @numberOption<NumberDecoder>("shift", "Shift", { defaultValue: 64 })
    private shift: number = 64;

    /**
     * Creates a new number decoder.
     *
     * @param base  Optional number base. Defaults to 10.
     * @param shift  Optional number shift. Defaults to 64.
     */
    public constructor(base?: number, shift?: number) {
        super();
        if (base != null) {
            this.base = base;
        }
        if (shift != null) {
            this.shift = shift;
        }
    }

    /**
     * Returns the number base.
     *
     * @return The number base.
     */
    public getBase(): number {
        return this.base;
    }

    /**
     * Sets the number base.
     *
     * @param base  The number base to set.
     */
    public setBase(base: number): void {
        this.base = base;
    }

    /**
     * Returns the number shift.
     *
     * @return The number shift.
     */
    public getShift(): number {
        return this.shift;
    }

    /**
     * Sets the number shift.
     *
     * @param shift  The number shift to set.
     */
    public setShift(shift: number): void {
        this.shift = shift;
    }

    /**
     * Returns the regular expression range to match digits.
     *
     * @return The regular expression range to match digits.
     */
    private getRange(): string {
        const base = this.base;
        return "[0-" + Math.min(9, base - 1) + (base > 10 ? "a-" + String.fromCharCode(86 + base) : "") + "]+";
    }

    /**
     * Generates (and caches) the regular expression to match a single numeric value.
     *
     * @return The regular expression to match a single numeric value.
     */
    private getNumberRegExp(): RegExp {
        if (this.numberRegExp == null) {
            const range = this.getRange();
            this.numberRegExp = new RegExp(`\\s*(${range})( *)`, "gi");
        }
        return this.numberRegExp;
    }

    /**
     * Generates (and caches) the regular expression to match a group of numeric values.
     *
     * @return The regular expression to match a group of numeric values.
     */
    private getGroupRegExp(): RegExp {
        if (this.groupRegExp == null) {
            const range = this.getRange();
            this.groupRegExp = new RegExp(`\\b(${range}(?: +${range})*)\\b`, "gi");
        }
        return this.groupRegExp;
    }

    /**
     * Resets cached regular expressions. Internally called when the number base has been changed.
     */
    private resetCaches(): void {
        this.groupRegExp = null;
        this.numberRegExp = null;
    }

    /** @inheritDoc */
    public convert(input: string): string {
        return input.replace(this.getGroupRegExp(), match =>
            match.replace(this.getNumberRegExp(), (match, dummy, spaces: string) =>
                String.fromCharCode(this.shift + parseInt(match, this.base)) + spaces.substring(1)
            )
        );
    }
}
