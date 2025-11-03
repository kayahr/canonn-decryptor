import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { KeywordDecoder } from "../../../main/decryptor/converters/KeywordDecoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("KeywordDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            assertSame(new KeywordDecoder().keyword, "");
        });
        it("initializes to given keyword", () => {
            assertSame(new KeywordDecoder({ keyword: "Canonn" }).keyword, "Canonn");
        });
        it("initializes to standard alphabet when no keyword given", () => {
            assertSame(new KeywordDecoder().getAlphabet(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        });
        it("creates correct alphabet when keyword is given", () => {
            assertSame(new KeywordDecoder({ keyword: "Keyword" }).getAlphabet(), "KEYWORDABCFGHIJLMNPQSTUVXZ");
            assertSame(new KeywordDecoder({ keyword: "The quick brown fox jumps over the lazy dog" }).getAlphabet(), "THEQUICKBROWNFXJMPSVLAZYDG");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const decoder = new KeywordDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            assertSame(decoder.keyword, "Canonn");
        });
        it("updates the alphabet", () => {
            const decoder = new KeywordDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            assertSame(decoder.getAlphabet(), "CANOBDEFGHIJKLMPQRSTUVWXYZ");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new KeywordDecoder({ keyword: "Imperial Clipper" }).convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new KeywordDecoder({ keyword: "Imperial Cutter" }).convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unencoded characters", () => {
            assertSame(new KeywordDecoder({ keyword: "Sidewinder" }).convert("1ö_<"), "1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            assertSame(new KeywordDecoder({ keyword: "Eagle Mk3" }).convert("kooaer"), "foobar");
        });
        it("decodes normal upper-case characters", () => {
            assertSame(new KeywordDecoder({ keyword: "Asp Explorer" }).convert("LIISAM"), "FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            assertSame(new KeywordDecoder({ keyword: "Anaconda" }).convert("BmmNar"), "FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            assertSame(new KeywordDecoder({ keyword: "Cobra Mk3" }).convert("#12MllOcq!"), "#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new KeywordDecoder({ keyword: "Secret" }).toJSON(), {
                type: "keyword-decoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new KeywordDecoder({ keyword: "" }).toJSON(), {
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
            assertInstanceOf(converter, KeywordDecoder);
            assertSame(converter.keyword, "Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<KeywordDecoder>({ type: "keyword-decoder" });
            assertInstanceOf(converter, KeywordDecoder);
            assertSame(converter.keyword, "");
        });
    });
});
