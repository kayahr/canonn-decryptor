import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { Rot13 } from "../../../main/decryptor/converters/Rot13.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("Rot13", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new Rot13().convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new Rot13().convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unrotated characters", () => {
            assertSame(new Rot13().convert("1ö_<"), "1ö_<");
        });
        it("rotates normal lower-case characters", () => {
            assertSame(new Rot13().convert("foobar"), "sbbone");
            assertSame(new Rot13().convert("az"), "nm");
            assertSame(new Rot13().convert("nm"), "az");
        });
        it("rotates normal upper-case characters", () => {
            assertSame(new Rot13().convert("FOOBAR"), "SBBONE");
            assertSame(new Rot13().convert("AZ"), "NM");
            assertSame(new Rot13().convert("NM"), "AZ");
        });
        it("rotates normal mixed-case characters", () => {
            assertSame(new Rot13().convert("FooBar"), "SbbOne");
        });
        it("rotates only normal characters in mixed string", () => {
            assertSame(new Rot13().convert("#12FooBar!"), "#12SbbOne!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new Rot13().toJSON(), {
                type: "rot13"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Rot13>({ type: "rot13" });
            assertInstanceOf(converter, Rot13);
        });
    });
});
