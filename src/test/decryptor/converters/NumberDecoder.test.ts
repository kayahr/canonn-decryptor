import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { NumberDecoder } from "../../../main/decryptor/converters/NumberDecoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("NumberDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            assertEquals(new NumberDecoder().convert(""), "");
        });
        it("keeps non-number string", () => {
            assertEquals(new NumberDecoder().convert("not-a-number"), "not-a-number");
            assertEquals(new NumberDecoder().convert("not1234"), "not1234");
            assertEquals(new NumberDecoder().convert("1234nope"), "1234nope");
        });
        it("decodes decimal number", () => {
            assertEquals(new NumberDecoder().convert("1"), "A");
        });
        it("keeps out-of-scope number", () => {
            assertEquals(new NumberDecoder({ base: 9 }).convert("9"), "9");
        });
        it("decodes binary number", () => {
            assertEquals(new NumberDecoder({ base: 2, shift: 0 }).convert("11001010"), String.fromCharCode(0b11001010));
        });
        it("decodes hex number", () => {
            assertEquals(new NumberDecoder({ base: 16, shift: 0 }).convert("1ABc"), String.fromCharCode(0x1abc));
        });
        it("decodes octal number", () => {
            assertEquals(new NumberDecoder({ base: 8, shift: 0 }).convert("7654"), String.fromCharCode(0o7654));
        });
        it("decodes base-36 number", () => {
            assertEquals(new NumberDecoder({ base: 36, shift: 0 }).convert("a0Z"), String.fromCharCode(12995));
        });
        it("decodes sequence of numbers", () => {
            assertEquals(new NumberDecoder().convert("1 5 10"), "AEJ");
        });
        it("keeps white-spaces in front of number sequence", () => {
            assertEquals(new NumberDecoder().convert(" 1 5 10"), " AEJ");
            assertEquals(new NumberDecoder().convert("  1 5 10"), "  AEJ");
            assertEquals(new NumberDecoder().convert("  \n1 5 10"), "  \nAEJ");
            assertEquals(new NumberDecoder().convert("  \n\t1 5 10"), "  \n\tAEJ");
        });
        it("keeps white-spaces after number sequence", () => {
            assertEquals(new NumberDecoder().convert("1 5 10 "), "AEJ ");
            assertEquals(new NumberDecoder().convert("1 5 10  "), "AEJ  ");
            assertEquals(new NumberDecoder().convert("1 5 10\n  "), "AEJ\n  ");
            assertEquals(new NumberDecoder().convert("1 5 10\t\n  "), "AEJ\t\n  ");
        });
        it("keeps white-spaces between numbers but trims a leading space character", () => {
            assertEquals(new NumberDecoder().convert("1 5  10 5"), "AE JE");
            assertEquals(new NumberDecoder().convert("1 5   10 5"), "AE  JE");
            assertEquals(new NumberDecoder().convert("1 5\n10 5"), "AE\nJE");
            assertEquals(new NumberDecoder().convert("1 5\n\t\n10 5"), "AE\n\t\nJE");
            assertEquals(new NumberDecoder().convert("1 5 \n 10 5"), "AE \n JE");
        });
        it("keeps strings between numbers", () => {
            assertEquals(new NumberDecoder().convert("before it 1 5 between it 10 5 after it"),
                "before it AE between it JE after it");
        });
        it("correctly converts to space characters", () => {
            assertEquals(new NumberDecoder({ base: 16, shift: 0 }).convert("41 42 43 20 44 45 46 20 47 48 49"),
                "ABC DEF GHI");
        });
        it("correctly converts to new-line character", () => {
            assertEquals(new NumberDecoder({ base: 16, shift: 0 }).convert("41 42 43 0a 44 45 46"),
                "ABC\nDEF");
        });
        it("decodes negative numbers in sequence", () => {
            assertEquals(new NumberDecoder({ shift: 66 }).convert("-1 0 1"), "ABC");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new NumberDecoder({ base: 8, shift: 32 }).toJSON(), {
                type: "number-decoder",
                options: {
                    base: 8,
                    shift: 32
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new NumberDecoder().toJSON(), { type: "number-decoder" });
            assertEquals(new NumberDecoder({ base: 4 }).toJSON(), { type: "number-decoder", options: { base: 4 } });
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
            assertInstanceOf(converter, NumberDecoder);
            assertSame(converter.base, 5);
            assertSame(converter.shift, 31);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<NumberDecoder>({ type: "number-decoder" });
            assertInstanceOf(converter, NumberDecoder);
            assertSame(converter.base, 10);
            assertSame(converter.shift, 64);
        });
    });
});
