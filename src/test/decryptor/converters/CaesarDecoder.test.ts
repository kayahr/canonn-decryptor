import { describe, it } from "node:test";

import { CaesarDecoder } from "../../../main/decryptor/converters/CaesarDecoder.ts";
import { CaesarEncoder } from "../../../main/decryptor/converters/CaesarEncoder.ts";
import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("CaesarDecoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new CaesarDecoder().convert(""), "");
            assertSame(new CaesarDecoder({}).convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new CaesarDecoder({ auto: false }).convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unrotated characters", () => {
            assertSame(new CaesarDecoder({ auto: false }).convert("1ö_<"), "1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            assertSame(new CaesarDecoder({ auto: false, rotation: 5 }).convert("kttgfw"), "foobar");
        });
        it("decodes normal upper-case characters", () => {
            assertSame(new CaesarDecoder({ auto: false, rotation: 12 }).convert("RAANMD"), "FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            assertSame(new CaesarDecoder({ auto: false, rotation: 25 }).convert("EnnAzq"), "FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            assertSame(new CaesarDecoder({ auto: false, rotation: 7 }).convert("#12MvvIhy!"), "#12FooBar!");
        });
        it("automatically detects rotation in auto mode", () => {
            const decoder = new CaesarDecoder({ auto: true });
            for (let i = 0; i < 26; ++i) {
                const encoded = new CaesarEncoder({ rotation: i }).convert("Elite Dangerous");
                const decoded = decoder.convert(encoded);
                assertSame(decoded, "Elite Dangerous");
                assertSame(decoder.rotation, i);
            }
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new CaesarDecoder({ auto: false, rotation: 15 }).toJSON(), {
                type: "caesar-decoder",
                options: {
                    auto: false,
                    rotation: 15
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new CaesarDecoder({ auto: true, rotation: 13 }).toJSON(), {
                type: "caesar-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<CaesarDecoder>({
                type: "caesar-decoder",
                options: {
                    rotation: 15
                }
            });
            assertInstanceOf(converter, CaesarDecoder);
            assertSame(converter.rotation, 15);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<CaesarDecoder>({ type: "caesar-decoder" });
            assertInstanceOf(converter, CaesarDecoder);
            assertSame(converter.rotation, 13);
        });
    });
});
