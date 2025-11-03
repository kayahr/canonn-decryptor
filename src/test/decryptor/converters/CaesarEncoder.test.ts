import { describe, it } from "node:test";

import { CaesarEncoder } from "../../../main/decryptor/converters/CaesarEncoder.ts";
import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("CaesarEncoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new CaesarEncoder().convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new CaesarEncoder().convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unrotatable characters", () => {
            assertSame(new CaesarEncoder().convert("1ö_<"), "1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            assertSame(new CaesarEncoder({ rotation: 5 }).convert("foobar"), "kttgfw");
        });
        it("encodes normal upper-case characters", () => {
            assertSame(new CaesarEncoder({ rotation: 12 }).convert("FOOBAR"), "RAANMD");
        });
        it("encodes normal mixed-case characters", () => {
            assertSame(new CaesarEncoder({ rotation: 25 }).convert("FooBar"), "EnnAzq");
        });
        it("encodes only normal characters in mixed string", () => {
            assertSame(new CaesarEncoder({ rotation: 7 }).convert("#12FooBar!"), "#12MvvIhy!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new CaesarEncoder({ rotation: 12 }).toJSON(), {
                type: "caesar-encoder",
                options: {
                    rotation: 12
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new CaesarEncoder({ rotation: 13 }).toJSON(), {
                type: "caesar-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<CaesarEncoder>({
                type: "caesar-encoder",
                options: {
                    rotation: 11
                }
            });
            assertInstanceOf(converter, CaesarEncoder);
            assertSame(converter.rotation, 11);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<CaesarEncoder>({ type: "caesar-encoder" });
            assertInstanceOf(converter, CaesarEncoder);
            assertSame(converter.rotation, 13);
        });
    });
});
