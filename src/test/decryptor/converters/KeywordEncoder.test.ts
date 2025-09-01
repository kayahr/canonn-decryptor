import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { KeywordEncoder } from "../../../main/decryptor/converters/KeywordEncoder.js";

describe("KeywordEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new KeywordEncoder().keyword).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new KeywordEncoder({ keyword: "Canonn" }).keyword).toBe("Canonn");
        });
        it("initializes to standard alphabet when no keyword given", () => {
            expect(new KeywordEncoder().getAlphabet()).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        });
        it("creates correct alphabet when keyword is given", () => {
            expect(new KeywordEncoder({ keyword: "Keyword" }).getAlphabet())
                .toBe("KEYWORDABCFGHIJLMNPQSTUVXZ");
            expect(new KeywordEncoder({ keyword: "The quick brown fox jumps over the lazy dog" }).getAlphabet())
                .toBe("THEQUICKBROWNFXJMPSVLAZYDG");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const encoder = new KeywordEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            expect(encoder.keyword).toBe("Canonn");
        });
        it("updates the alphabet", () => {
            const encoder = new KeywordEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            expect(encoder.getAlphabet()).toBe("CANOBDEFGHIJKLMPQRSTUVWXYZ");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new KeywordEncoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new KeywordEncoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencodable characters", () => {
            expect(new KeywordEncoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            expect(new KeywordEncoder({ keyword: "Eagle Mk3" }).convert("foobar")).toBe("kooaer");
        });
        it("encodes normal upper-case characters", () => {
            expect(new KeywordEncoder({ keyword: "Asp Explorer" }).convert("FOOBAR")).toBe("LIISAM");
        });
        it("encodes normal mixed-case characters", () => {
            expect(new KeywordEncoder({ keyword: "Anaconda" }).convert("FooBar")).toBe("BmmNar");
        });
        it("encodes only normal characters in mixed string", () => {
            expect(new KeywordEncoder({ keyword: "Cobra Mk3" }).convert("#12FooBar!")).toBe("#12MllOcq!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new KeywordEncoder({ keyword: "Secret" }).toJSON()).toEqual({
                type: "keyword-encoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new KeywordEncoder({ keyword: "" }).toJSON()).toEqual({
                type: "keyword-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<KeywordEncoder>({
                type: "keyword-encoder",
                options: {
                    keyword: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(KeywordEncoder);
            expect(converter.keyword).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<KeywordEncoder>({ type: "keyword-encoder" });
            expect(converter).toBeInstanceOf(KeywordEncoder);
            expect(converter.keyword).toBe("");
        });
    });
});
