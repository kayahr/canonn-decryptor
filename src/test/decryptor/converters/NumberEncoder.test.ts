import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { NumberEncoder } from "../../../main/decryptor/converters/NumberEncoder.js";

describe("NumberEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            expect(new NumberEncoder().convert("")).toEqual("");
        });
        it("encodes correctly with default options", () => {
            expect(new NumberEncoder().convert("A Test\nText")).toEqual("1  20 37 51 52\n20 37 56 52");
            expect(new NumberEncoder({}).convert("A Test\nText")).toEqual("1  20 37 51 52\n20 37 56 52");
        });
        it("encodes correctly with custom base", () => {
            expect(new NumberEncoder({ base: 16 }).convert("A funny\ntext")).toEqual("1  26 35 2e 2e 39\n34 25 38 34");
        });
        it("encodes correctly with custom length", () => {
            expect(new NumberEncoder({ length: 4 }).convert("A funny\ntext")).toEqual("0001  0038 0053 0046 0046 0057\n0052 0037 0056 0052");
        });
        it("encodes correctly with custom shift", () => {
            expect(new NumberEncoder({ shift: -32 }).convert("A funny\ntext")).toEqual("33  70 85 78 78 89\n84 69 88 84");
        });
        it("encodes correctly with custom separator", () => {
            expect(new NumberEncoder({ separator: "-" }).convert("A funny\ntext")).toEqual("1 38-53-46-46-57\n52-37-56-52");
            expect(new NumberEncoder({ separator: "--" }).convert("A funny\ntext")).toEqual("1 38--53--46--46--57\n52--37--56--52");
        });
        it("encodes correctly with custom whitespace handling", () => {
            expect(new NumberEncoder({ whitespace: "discard" }).convert("A funny\ntext")).toEqual("1 38 53 46 46 57 52 37 56 52");
            expect(new NumberEncoder({ whitespace: "encode" }).convert("A funny\ntext")).toEqual("1 -32 38 53 46 46 57 -54 52 37 56 52");
        });
        it("encodes correctly with custom separator and whitespace handling", () => {
            expect(new NumberEncoder({ separator: "-", whitespace: "discard" }).convert("A funny\ntext")).toEqual("1-38-53-46-46-57-52-37-56-52");
            expect(new NumberEncoder({ separator: "-", whitespace: "encode" }).convert("A funny\ntext")).toEqual("1--32-38-53-46-46-57--54-52-37-56-52");
        });
        it("encodes correctly with custom separator, whitespace, length and shift", () => {
            expect(new NumberEncoder({ separator: "/", length: 4, shift: -53, whitespace: "encode" }).convert("A funny\ntext"))
                .toEqual("0012/-0021/0049/0064/0057/0057/0068/-0043/0063/0048/0067/0063");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter with all custom options", () => {
            const encoder = new NumberEncoder();
            encoder.base = 8;
            encoder.shift = 32;
            encoder.length = 2;
            encoder.whitespace = "encode";
            encoder.separator = "-";
            expect(encoder.toJSON()).toEqual({
                type: "number-encoder",
                options: {
                    base: 8,
                    shift: 32,
                    length: 2,
                    whitespace: "encode",
                    separator: "-"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new NumberEncoder().toJSON()).toEqual({ type: "number-encoder" });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<NumberEncoder>({
                type: "number-encoder",
                options: {
                    base: 5,
                    shift: 31,
                    whitespace: "encode",
                    length: 3,
                    separator: "--"
                }
            });
            expect(converter).toBeInstanceOf(NumberEncoder);
            expect(converter.base).toBe(5);
            expect(converter.shift).toBe(31);
            expect(converter.whitespace).toBe("encode");
            expect(converter.separator).toBe("--");
            expect(converter.length).toBe(3);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<NumberEncoder>({ type: "number-encoder" });
            expect(converter).toBeInstanceOf(NumberEncoder);
            expect(converter.base).toBe(10);
            expect(converter.shift).toBe(-64);
            expect(converter.whitespace).toBe("keep");
            expect(converter.separator).toBe(" ");
            expect(converter.length).toBe(1);
        });
    });
});
