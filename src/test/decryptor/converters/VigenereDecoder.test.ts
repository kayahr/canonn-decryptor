import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { VigenereDecoder } from "../../../main/decryptor/converters/VigenereDecoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("VigenereDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            assertSame(new VigenereDecoder().keyword, "");
        });
        it("initializes to given keyword", () => {
            assertSame(new VigenereDecoder({ keyword: "Canonn" }).keyword, "Canonn");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const decoder = new VigenereDecoder({ keyword: "Not this one" });
            decoder.keyword = "Canonn";
            assertSame(decoder.keyword, "Canonn");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new VigenereDecoder({ keyword: "Imperial Clipper" }).convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new VigenereDecoder({ keyword: "Imperial Cutter" }).convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unencoded characters", () => {
            assertSame(new VigenereDecoder({ keyword: "Sidewinder" }).convert("1ö_<"), "1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            assertSame(new VigenereDecoder({ keyword: "Eagle Mk3" }).convert("joumed"), "foobar");
        });
        it("decodes normal upper-case characters", () => {
            assertSame(new VigenereDecoder({ keyword: "Asp Explorer" }).convert("FGDFXG"), "FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            assertSame(new VigenereDecoder({ keyword: "Anaconda" }).convert("FboDoe"), "FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            assertSame(new VigenereDecoder({ keyword: "Cobra Mk3" }).convert("#12HcpSad!"), "#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new VigenereDecoder({ keyword: "Secret" }).toJSON(), {
                type: "vigenere-decoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new VigenereDecoder({ keyword: "" }).toJSON(), {
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
            assertInstanceOf(converter, VigenereDecoder);
            assertSame(converter.keyword, "Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<VigenereDecoder>({ type: "vigenere-decoder" });
            assertInstanceOf(converter, VigenereDecoder);
            assertSame(converter.keyword, "");
        });
    });
});
