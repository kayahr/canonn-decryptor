import { describe, it } from "node:test";

import { Base64Decoder } from "../../../main/decryptor/converters/Base64Decoder.ts";
import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("Base64Decoder", () => {
    describe("constructor", () => {
        it("sets output type to text by default", () => {
            assertSame(new Base64Decoder().output, "txt");
        });
        it("allows setting an initial output type", () => {
            assertSame(new Base64Decoder({ output: "hex" }).output, "hex");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new Base64Decoder().convert(""), "");
        });
        it("decodes invalid base64 into an error message", () => {
            assertSame(new Base64Decoder().convert("a"), "DECODING ERROR: Invalid string. Length must be a multiple of 4");
        });
        it("decodes valid base64 to UTF-8 text", () => {
            assertSame(new Base64Decoder({ output: "txt" }).convert("Zm9vYmFyIMO2w6TDvMOf"), "foobar öäüß");
        });
        it("decodes valid base64 to hex", () => {
            assertSame(new Base64Decoder({ output: "hex" }).convert("Zm9vYmFy"), "66 6f 6f 62 61 72");
        });
        it("decodes valid base64 to decimals", () => {
            assertSame(new Base64Decoder({ output: "dec" }).convert("Zm9vYmFy"), "102 111 111 98 97 114");
        });
        it("decodes valid base64 to binary", () => {
            assertSame(new Base64Decoder({ output: "bin" }).convert("Zm9vYmFy"), "01100110 01101111 01101111 01100010 01100001 01110010");
        });
        it("ignores whitespaces", () => {
            assertSame(new Base64Decoder({ output: "hex" }).convert(" Zm\n9\rv\tYm Fy "), "66 6f 6f 62 61 72");
        });
    });

    describe("outputType", () => {
        it("sets the output type", () => {
            const decoder = new Base64Decoder();
            assertSame(decoder.output, "txt");
            assertSame(decoder.convert("Zm9vYmFy"), "foobar");
            decoder.output = "hex";
            assertSame(decoder.output, "hex");
            assertSame(decoder.convert("Zm9vYmFy"), "66 6f 6f 62 61 72");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new Base64Decoder({ output: "hex" }).toJSON(), {
                type: "base64-decoder",
                options: {
                    output: "hex"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new Base64Decoder().toJSON(), {
                type: "base64-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Base64Decoder>({
                type: "base64-decoder",
                options: {
                    output: "hex"
                }
            });
            assertInstanceOf(converter, Base64Decoder);
            assertSame(converter.output, "hex");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<Base64Decoder>({ type: "base64-decoder" });
            assertInstanceOf(converter, Base64Decoder);
            assertSame(converter.output, "txt");
        });
    });
});
