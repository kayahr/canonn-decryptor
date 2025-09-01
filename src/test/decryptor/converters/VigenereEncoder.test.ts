import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { VigenereEncoder } from "../../../main/decryptor/converters/VigenereEncoder.js";

describe("VigenereEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new VigenereEncoder().keyword).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new VigenereEncoder({ keyword: "Canonn" }).keyword).toBe("Canonn");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const encoder = new VigenereEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            expect(encoder.keyword).toBe("Canonn");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new VigenereEncoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new VigenereEncoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencodable characters", () => {
            expect(new VigenereEncoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            expect(new VigenereEncoder({ keyword: "Eagle Mk3" }).convert("foobar")).toBe("joumed");
        });
        it("encodes normal upper-case characters", () => {
            expect(new VigenereEncoder({ keyword: "Asp Explorer" }).convert("FOOBAR")).toBe("FGDFXG");
        });
        it("encodes normal mixed-case characters", () => {
            expect(new VigenereEncoder({ keyword: "Anaconda" }).convert("FooBar")).toBe("FboDoe");
        });
        it("encodes only normal characters in mixed string", () => {
            expect(new VigenereEncoder({ keyword: "Cobra Mk3" }).convert("#12FooBar!")).toBe("#12HcpSad!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new VigenereEncoder({ keyword: "Secret" }).toJSON()).toEqual({
                type: "vigenere-encoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new VigenereEncoder({ keyword: "" }).toJSON()).toEqual({
                type: "vigenere-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<VigenereEncoder>({
                type: "vigenere-encoder",
                options: {
                    keyword: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(VigenereEncoder);
            expect(converter.keyword).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<VigenereEncoder>({ type: "vigenere-encoder" });
            expect(converter).toBeInstanceOf(VigenereEncoder);
            expect(converter.keyword).toBe("");
        });
    });
});
