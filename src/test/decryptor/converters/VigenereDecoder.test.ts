import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { VigenereDecoder } from "../../../main/decryptor/converters/VigenereDecoder.js";

describe("VigenereDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new VigenereDecoder().keyword).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new VigenereDecoder({ keyword: "Canonn" }).keyword).toBe("Canonn");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const decoder = new VigenereDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            expect(decoder.keyword).toBe("Canonn");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new VigenereDecoder({ keyword: "Imperial Clipper" }).convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new VigenereDecoder({ keyword: "Imperial Cutter" }).convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencoded characters", () => {
            expect(new VigenereDecoder({ keyword: "Sidewinder" }).convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new VigenereDecoder({ keyword: "Eagle Mk3" }).convert("joumed")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new VigenereDecoder({ keyword: "Asp Explorer" }).convert("FGDFXG")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new VigenereDecoder({ keyword: "Anaconda" }).convert("FboDoe")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new VigenereDecoder({ keyword: "Cobra Mk3" }).convert("#12HcpSad!")).toBe("#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new VigenereDecoder({ keyword: "Secret" }).toJSON()).toEqual({
                type: "vigenere-decoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new VigenereDecoder({ keyword: "" }).toJSON()).toEqual({
                type: "vigenere-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<VigenereDecoder>({
                type: "vigenere-decoder",
                options: {
                    keyword: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(VigenereDecoder);
            expect(converter.keyword).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<VigenereDecoder>({ type: "vigenere-decoder" });
            expect(converter).toBeInstanceOf(VigenereDecoder);
            expect(converter.keyword).toBe("");
        });
    });
});
