import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { KeywordDecoder } from "../../../main/decryptor/converters/KeywordDecoder.js";

describe("KeywordDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new KeywordDecoder().keyword).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new KeywordDecoder({ keyword: "Canonn" }).keyword).toBe("Canonn");
        });
        it("initializes to standard alphabet when no keyword given", () => {
            expect(new KeywordDecoder().getAlphabet()).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        });
        it("creates correct alphabet when keyword is given", () => {
            expect(new KeywordDecoder({ keyword: "Keyword" }).getAlphabet())
                .toBe("KEYWORDABCFGHIJLMNPQSTUVXZ");
            expect(new KeywordDecoder({ keyword: "The quick brown fox jumps over the lazy dog" }).getAlphabet())
                .toBe("THEQUICKBROWNFXJMPSVLAZYDG");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const decoder = new KeywordDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            expect(decoder.keyword).toBe("Canonn");
        });
        it("updates the alphabet", () => {
            const decoder = new KeywordDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            expect(decoder.getAlphabet()).toBe("CANOBDEFGHIJKLMPQRSTUVWXYZ");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new KeywordDecoder({ keyword: "Imperial Clipper" }).convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new KeywordDecoder({ keyword: "Imperial Cutter" }).convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencoded characters", () => {
            expect(new KeywordDecoder({ keyword: "Sidewinder" }).convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new KeywordDecoder({ keyword: "Eagle Mk3" }).convert("kooaer")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new KeywordDecoder({ keyword: "Asp Explorer" }).convert("LIISAM")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new KeywordDecoder({ keyword: "Anaconda" }).convert("BmmNar")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new KeywordDecoder({ keyword: "Cobra Mk3" }).convert("#12MllOcq!")).toBe("#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new KeywordDecoder({ keyword: "Secret" }).toJSON()).toEqual({
                type: "keyword-decoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new KeywordDecoder({ keyword: "" }).toJSON()).toEqual({
                type: "keyword-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<KeywordDecoder>({
                type: "keyword-decoder",
                options: {
                    keyword: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(KeywordDecoder);
            expect(converter.keyword).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<KeywordDecoder>({ type: "keyword-decoder" });
            expect(converter).toBeInstanceOf(KeywordDecoder);
            expect(converter.keyword).toBe("");
        });
    });
});
