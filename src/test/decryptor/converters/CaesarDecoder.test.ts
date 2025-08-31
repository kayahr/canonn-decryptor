import { describe, expect, it } from "vitest";

import { CaesarDecoder } from "../../../main/decryptor/converters/CaesarDecoder.js";
import { CaesarEncoder } from "../../../main/decryptor/converters/CaesarEncoder.js";
import { Converter } from "../../../main/decryptor/converters/Converter.js";

describe("CaesarDecoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new CaesarDecoder(false).convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new CaesarDecoder(false).convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unrotated characters", () => {
            expect(new CaesarDecoder(false).convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new CaesarDecoder(false, 5).convert("kttgfw")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new CaesarDecoder(false, 12).convert("RAANMD")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new CaesarDecoder(false, 25).convert("EnnAzq")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new CaesarDecoder(false, 7).convert("#12MvvIhy!")).toBe("#12FooBar!");
        });
        it("automatically detects rotation in auto mode", () => {
            const decoder = new CaesarDecoder(true);
            for (let i = 0; i < 26; ++i) {
                const encoded = new CaesarEncoder(i).convert("Elite Dangerous");
                const decoded = decoder.convert(encoded);
                expect(decoded).toBe("Elite Dangerous");
                expect(decoder.getRotation()).toBe(i);
            }
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new CaesarDecoder(false, 15).toJSON()).toEqual({
                type: "caesar-decoder",
                options: {
                    auto: false,
                    rotation: 15
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new CaesarDecoder(true, 13).toJSON()).toEqual({
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
            expect(converter).toBeInstanceOf(CaesarDecoder);
            expect(converter.getRotation()).toBe(15);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<CaesarDecoder>({ type: "caesar-decoder" });
            expect(converter).toBeInstanceOf(CaesarDecoder);
            expect(converter.getRotation()).toBe(13);
        });
    });
});
