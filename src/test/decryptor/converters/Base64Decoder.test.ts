import { describe, expect, it } from "vitest";

import { Base64Decoder } from "../../../main/decryptor/converters/Base64Decoder.js";
import { Converter } from "../../../main/decryptor/converters/Converter.js";

describe("Base64Decoder", () => {
    describe("constructor", () => {
        it("sets output type to text by default", () => {
            expect(new Base64Decoder().output).toBe("txt");
        });
        it("allows setting an initial output type", () => {
            expect(new Base64Decoder({ output: "hex" }).output).toBe("hex");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Base64Decoder().convert("")).toBe("");
        });
        it("decodes invalid base64 into an error message", () => {
            expect(new Base64Decoder().convert("a")).toBe("DECODING ERROR: Invalid string. Length must be a multiple of 4");
        });
        it("decodes valid base64 to UTF-8 text", () => {
            expect(new Base64Decoder({ output: "txt" }).convert("Zm9vYmFyIMO2w6TDvMOf")).toBe("foobar öäüß");
        });
        it("decodes valid base64 to hex", () => {
            expect(new Base64Decoder({ output: "hex" }).convert("Zm9vYmFy")).toBe("66 6f 6f 62 61 72");
        });
        it("decodes valid base64 to decimals", () => {
            expect(new Base64Decoder({ output: "dec" }).convert("Zm9vYmFy")).toBe("102 111 111 98 97 114");
        });
        it("decodes valid base64 to binary", () => {
            expect(new Base64Decoder({ output: "bin" }).convert("Zm9vYmFy"))
                .toBe("01100110 01101111 01101111 01100010 01100001 01110010");
        });
        it("ignores whitespaces", () => {
            expect(new Base64Decoder({ output: "hex" }).convert(" Zm\n9\rv\tYm Fy ")).toBe("66 6f 6f 62 61 72");
        });
    });

    describe("outputType", () => {
        it("sets the output type", () => {
            const decoder = new Base64Decoder();
            expect(decoder.output).toBe("txt");
            expect(decoder.convert("Zm9vYmFy")).toBe("foobar");
            decoder.output = "hex";
            expect(decoder.output).toBe("hex");
            expect(decoder.convert("Zm9vYmFy")).toBe("66 6f 6f 62 61 72");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Base64Decoder({ output: "hex" }).toJSON()).toEqual({
                type: "base64-decoder",
                options: {
                    output: "hex"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new Base64Decoder().toJSON()).toEqual({
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
            expect(converter).toBeInstanceOf(Base64Decoder);
            expect(converter.output).toBe("hex");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<Base64Decoder>({ type: "base64-decoder" });
            expect(converter).toBeInstanceOf(Base64Decoder);
            expect(converter.output).toBe("txt");
        });
    });
});
