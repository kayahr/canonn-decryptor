import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { Reverse } from "../../../main/decryptor/converters/Reverse.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("Reverse", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new Reverse().convert(""), "");
        });
        it("reverses normal lower-case characters", () => {
            assertSame(new Reverse().convert("foobar"), "raboof");
        });
        it("reverses normal upper-case characters", () => {
            assertSame(new Reverse().convert("FOOBAR"), "RABOOF");
        });
        it("reverses mixed-case characters", () => {
            assertSame(new Reverse().convert("FooBar"), "raBooF");
        });
        it("reverses non-alphabet characters", () => {
            assertSame(new Reverse().convert("1ö_<"), "<_ö1");
        });
        it("reverses mixed strings", () => {
            assertSame(new Reverse().convert("#12FooBar!"), "!raBooF21#");
        });
        it("reverses multiple lines", () => {
            assertSame(new Reverse().convert("Line 1\nLine 2\nLine 3"), "3 eniL\n2 eniL\n1 eniL");
        });
        it("reverses multiple lines but does not reverse CRLF or LFCR sequences", () => {
            assertSame(new Reverse().convert("Line 1\r\nLine 2\n\rLine 3"), "3 eniL\n\r2 eniL\r\n1 eniL");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new Reverse().toJSON(), {
                type: "reverse"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Reverse>({ type: "reverse" });
            assertInstanceOf(converter, Reverse);
        });
    });
});
