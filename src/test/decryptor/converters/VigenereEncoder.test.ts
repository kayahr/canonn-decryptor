import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { VigenereEncoder } from "../../../main/decryptor/converters/VigenereEncoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("VigenereEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            assertSame(new VigenereEncoder().keyword, "");
        });
        it("initializes to given keyword", () => {
            assertSame(new VigenereEncoder({ keyword: "Canonn" }).keyword, "Canonn");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const encoder = new VigenereEncoder({ keyword: "Not this one" });
            encoder.keyword = "Canonn";
            assertSame(encoder.keyword, "Canonn");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new VigenereEncoder().convert(""), "");
        });
        it("keeps white-space only string", () => {
            assertSame(new VigenereEncoder().convert(" \n\r\t"), " \n\r\t");
        });
        it("keeps unencodable characters", () => {
            assertSame(new VigenereEncoder().convert("1ö_<"), "1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            assertSame(new VigenereEncoder({ keyword: "Eagle Mk3" }).convert("foobar"), "joumed");
        });
        it("encodes normal upper-case characters", () => {
            assertSame(new VigenereEncoder({ keyword: "Asp Explorer" }).convert("FOOBAR"), "FGDFXG");
        });
        it("encodes normal mixed-case characters", () => {
            assertSame(new VigenereEncoder({ keyword: "Anaconda" }).convert("FooBar"), "FboDoe");
        });
        it("encodes only normal characters in mixed string", () => {
            assertSame(new VigenereEncoder({ keyword: "Cobra Mk3" }).convert("#12FooBar!"), "#12HcpSad!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new VigenereEncoder({ keyword: "Secret" }).toJSON(), {
                type: "vigenere-encoder",
                options: {
                    keyword: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new VigenereEncoder({ keyword: "" }).toJSON(), {
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
            assertInstanceOf(converter, VigenereEncoder);
            assertSame(converter.keyword, "Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<VigenereEncoder>({ type: "vigenere-encoder" });
            assertInstanceOf(converter, VigenereEncoder);
            assertSame(converter.keyword, "");
        });
    });
});
