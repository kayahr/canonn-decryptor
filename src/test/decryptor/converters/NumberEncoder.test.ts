import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { NumberEncoder } from "../../../main/decryptor/converters/NumberEncoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("NumberEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            assertEquals(new NumberEncoder().convert(""), "");
        });
        it("encodes correctly with default options", () => {
            assertEquals(new NumberEncoder().convert("A Test\nText"), "1  20 37 51 52\n20 37 56 52");
            assertEquals(new NumberEncoder({}).convert("A Test\nText"), "1  20 37 51 52\n20 37 56 52");
        });
        it("encodes correctly with custom base", () => {
            assertEquals(new NumberEncoder({ base: 16 }).convert("A funny\ntext"), "1  26 35 2e 2e 39\n34 25 38 34");
        });
        it("encodes correctly with custom length", () => {
            assertEquals(new NumberEncoder({ length: 4 }).convert("A funny\ntext"), "0001  0038 0053 0046 0046 0057\n0052 0037 0056 0052");
        });
        it("encodes correctly with custom shift", () => {
            assertEquals(new NumberEncoder({ shift: -32 }).convert("A funny\ntext"), "33  70 85 78 78 89\n84 69 88 84");
        });
        it("encodes correctly with custom separator", () => {
            assertEquals(new NumberEncoder({ separator: "-" }).convert("A funny\ntext"), "1 38-53-46-46-57\n52-37-56-52");
            assertEquals(new NumberEncoder({ separator: "--" }).convert("A funny\ntext"), "1 38--53--46--46--57\n52--37--56--52");
        });
        it("encodes correctly with custom whitespace handling", () => {
            assertEquals(new NumberEncoder({ whitespace: "discard" }).convert("A funny\ntext"), "1 38 53 46 46 57 52 37 56 52");
            assertEquals(new NumberEncoder({ whitespace: "encode" }).convert("A funny\ntext"), "1 -32 38 53 46 46 57 -54 52 37 56 52");
        });
        it("encodes correctly with custom separator and whitespace handling", () => {
            assertEquals(new NumberEncoder({ separator: "-", whitespace: "discard" }).convert("A funny\ntext"), "1-38-53-46-46-57-52-37-56-52");
            assertEquals(new NumberEncoder({ separator: "-", whitespace: "encode" }).convert("A funny\ntext"), "1--32-38-53-46-46-57--54-52-37-56-52");
        });
        it("encodes correctly with custom separator, whitespace, length and shift", () => {
            assertEquals(new NumberEncoder({ separator: "/", length: 4, shift: -53, whitespace: "encode" }).convert("A funny\ntext"),
                "0012/-0021/0049/0064/0057/0057/0068/-0043/0063/0048/0067/0063");
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
            assertEquals(encoder.toJSON(), {
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
            assertEquals(new NumberEncoder().toJSON(), { type: "number-encoder" });
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
            assertInstanceOf(converter, NumberEncoder);
            assertSame(converter.base, 5);
            assertSame(converter.shift, 31);
            assertSame(converter.whitespace, "encode");
            assertSame(converter.separator, "--");
            assertSame(converter.length, 3);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<NumberEncoder>({ type: "number-encoder" });
            assertInstanceOf(converter, NumberEncoder);
            assertSame(converter.base, 10);
            assertSame(converter.shift, -64);
            assertSame(converter.whitespace, "keep");
            assertSame(converter.separator, " ");
            assertSame(converter.length, 1);
        });
    });
});
