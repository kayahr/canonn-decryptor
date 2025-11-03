import { describe, it } from "node:test";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";
import { Atbash } from "../../../main/decryptor/converters/Atbash.ts";
import { Converter } from "../../../main/decryptor/converters/Converter.ts";

describe("Atbash", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new Atbash().convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new Atbash().convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps non-alphabet characters", () => {
            assertSame(new Atbash().convert("1ö_<"), "1ö_<");
        });
        it("converts normal lower-case characters", () => {
            assertSame(new Atbash().convert("foobar"), "ullyzi");
        });
        it("converts normal upper-case characters", () => {
            assertSame(new Atbash().convert("FOOBAR"), "ULLYZI");
        });
        it("converts normal mixed-case characters", () => {
            assertSame(new Atbash().convert("FooBar"), "UllYzi");
        });
        it("converts only normal characters in mixed string", () => {
            assertSame(new Atbash().convert("#12FooBar!"), "#12UllYzi!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new Atbash().toJSON(), {
                type: "atbash"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Atbash>({ type: "atbash" });
            assertInstanceOf(converter, Atbash);
        });
    });
});
