import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { NumberDecoder } from "../../../main/decryptor/converters/NumberDecoder.js";

describe("NumberDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            expect(new NumberDecoder().convert("")).toEqual("");
        });
        it("keeps non-number string", () => {
            expect(new NumberDecoder().convert("not-a-number")).toEqual("not-a-number");
            expect(new NumberDecoder().convert("not1234")).toEqual("not1234");
            expect(new NumberDecoder().convert("1234nope")).toEqual("1234nope");
        });
        it("decodes decimal number", () => {
            expect(new NumberDecoder().convert("1")).toEqual("A");
        });
        it("keeps out-of-scope number", () => {
            expect(new NumberDecoder({ base: 9 }).convert("9")).toEqual("9");
        });
        it("decodes binary number", () => {
            expect(new NumberDecoder({ base: 2, shift: 0 }).convert("11001010")).toEqual(String.fromCharCode(0b11001010));
        });
        it("decodes hex number", () => {
            expect(new NumberDecoder({ base: 16, shift: 0 }).convert("1ABc")).toEqual(String.fromCharCode(0x1abc));
        });
        it("decodes octal number", () => {
            expect(new NumberDecoder({ base: 8, shift: 0 }).convert("7654")).toEqual(String.fromCharCode(0o7654));
        });
        it("decodes base-36 number", () => {
            expect(new NumberDecoder({ base: 36, shift: 0 }).convert("a0Z")).toEqual(String.fromCharCode(12995));
        });
        it("decodes sequence of numbers", () => {
            expect(new NumberDecoder().convert("1 5 10")).toEqual("AEJ");
        });
        it("keeps white-spaces in front of number sequence", () => {
            expect(new NumberDecoder().convert(" 1 5 10")).toEqual(" AEJ");
            expect(new NumberDecoder().convert("  1 5 10")).toEqual("  AEJ");
            expect(new NumberDecoder().convert("  \n1 5 10")).toEqual("  \nAEJ");
            expect(new NumberDecoder().convert("  \n\t1 5 10")).toEqual("  \n\tAEJ");
        });
        it("keeps white-spaces after number sequence", () => {
            expect(new NumberDecoder().convert("1 5 10 ")).toEqual("AEJ ");
            expect(new NumberDecoder().convert("1 5 10  ")).toEqual("AEJ  ");
            expect(new NumberDecoder().convert("1 5 10\n  ")).toEqual("AEJ\n  ");
            expect(new NumberDecoder().convert("1 5 10\t\n  ")).toEqual("AEJ\t\n  ");
        });
        it("keeps white-spaces between numbers but trims a leading space character", () => {
            expect(new NumberDecoder().convert("1 5  10 5")).toEqual("AE JE");
            expect(new NumberDecoder().convert("1 5   10 5")).toEqual("AE  JE");
            expect(new NumberDecoder().convert("1 5\n10 5")).toEqual("AE\nJE");
            expect(new NumberDecoder().convert("1 5\n\t\n10 5")).toEqual("AE\n\t\nJE");
            expect(new NumberDecoder().convert("1 5 \n 10 5")).toEqual("AE \n JE");
        });
        it("keeps strings between numbers", () => {
            expect(new NumberDecoder().convert("before it 1 5 between it 10 5 after it")).toEqual(
                "before it AE between it JE after it");
        });
        it("correctly converts to space characters", () => {
            expect(new NumberDecoder({ base: 16, shift: 0 }).convert("41 42 43 20 44 45 46 20 47 48 49")).toEqual(
                "ABC DEF GHI");
        });
        it("correctly converts to new-line character", () => {
            expect(new NumberDecoder({ base: 16, shift: 0 }).convert("41 42 43 0a 44 45 46")).toEqual(
                "ABC\nDEF");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new NumberDecoder({ base: 8, shift: 32 }).toJSON()).toEqual({
                type: "number-decoder",
                options: {
                    base: 8,
                    shift: 32
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new NumberDecoder().toJSON()).toEqual({ type: "number-decoder" });
            expect(new NumberDecoder({ base: 4 }).toJSON()).toEqual({ type: "number-decoder", options: { base: 4 } });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<NumberDecoder>({
                type: "number-decoder",
                options: {
                    base: 5,
                    shift: 31
                }
            });
            expect(converter).toBeInstanceOf(NumberDecoder);
            expect(converter.base).toBe(5);
            expect(converter.shift).toBe(31);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<NumberDecoder>({ type: "number-decoder" });
            expect(converter).toBeInstanceOf(NumberDecoder);
            expect(converter.base).toBe(10);
            expect(converter.shift).toBe(64);
        });
    });
});
