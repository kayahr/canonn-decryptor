import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { KeywordEncoder } from "../../../main/decryptor/converters/KeywordEncoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("KeywordEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            assertSame(new KeywordEncoder().keyword, "");
        });
        it("initializes to given keyword", () => {
            assertSame(new KeywordEncoder({ keyword: "Canonn" }).keyword, "Canonn");
        });
        it("initializes to standard alphabet when no keyword given", () => {
            assertSame(new KeywordEncoder().getAlphabet(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        });
        it("creates correct alphabet when keyword is given", () => {
            assertSame(new KeywordEncoder({ keyword: "Keyword" }).getAlphabet(), "KEYWORDABCFGHIJLMNPQSTUVXZ");
            assertSame(new KeywordEncoder({ keyword: "The quick brown fox jumps over the lazy dog" }).getAlphabet(), "THEQUICKBROWNFXJMPSVLAZYDG");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const encoder = new KeywordEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            assertSame(encoder.keyword, "Canonn");
        });
        it("updates the alphabet", () => {
            const encoder = new KeywordEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            assertSame(encoder.getAlphabet(), "CANOBDEFGHIJKLMPQRSTUVWXYZ");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new KeywordEncoder().convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new KeywordEncoder().convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unencodable characters", () => {
            assertSame(new KeywordEncoder().convert("1ö_<"), "1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            assertSame(new KeywordEncoder({ keyword: "Eagle Mk3" }).convert("foobar"), "kooaer");
        });
        it("encodes normal upper-case characters", () => {
            assertSame(new KeywordEncoder({ keyword: "Asp Explorer" }).convert("FOOBAR"), "LIISAM");
        });
        it("encodes normal mixed-case characters", () => {
            assertSame(new KeywordEncoder({ keyword: "Anaconda" }).convert("FooBar"), "BmmNar");
        });
        it("encodes only normal characters in mixed string", () => {
            assertSame(new KeywordEncoder({ keyword: "Cobra Mk3" }).convert("#12FooBar!"), "#12MllOcq!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new KeywordEncoder({ keyword: "Secret" }).toJSON(), {
                type: "keyword-encoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new KeywordEncoder({ keyword: "" }).toJSON(), {
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
            assertInstanceOf(converter, KeywordEncoder);
            assertSame(converter.keyword, "Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<KeywordEncoder>({ type: "keyword-encoder" });
            assertInstanceOf(converter, KeywordEncoder);
            assertSame(converter.keyword, "");
        });
    });
});
