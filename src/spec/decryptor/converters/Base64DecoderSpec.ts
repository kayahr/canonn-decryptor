import { Base64Decoder, Base64OutputType } from "../../../main/decryptor/converters/Base64Decoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("Base64Decoder", () => {
    describe("constructor", () => {
        it("sets output type to text by default", () => {
            expect(new Base64Decoder().getOutputType()).toBe(Base64OutputType.TEXT);
        });
        it("allows setting an initial output type", () => {
            expect(new Base64Decoder(Base64OutputType.BYTES).getOutputType()).toBe(Base64OutputType.BYTES);
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Base64Decoder().convert("")).toBe("");
        });
        it("decodes invalid base64 into an error message", () => {
            expect(new Base64Decoder().convert("a")).
                toBe("DECODING ERROR: Invalid string. Length must be a multiple of 4");
        });
        it("decodes valid base64 to UTF-8 text", () => {
            expect(new Base64Decoder(Base64OutputType.TEXT).convert("Zm9vYmFyIMO2w6TDvMOf")).toBe("foobar öäüß");
        });
        it("decodes valid base64 to bytes", () => {
            expect(new Base64Decoder(Base64OutputType.BYTES).convert("Zm9vYmFy")).toBe("66 6f 6f 62 61 72");
        });
    });

    describe("setOutputType", () => {
        it("sets the output type", () => {
            const decoder = new Base64Decoder();
            expect(decoder.getOutputType()).toBe(Base64OutputType.TEXT);
            expect(decoder.convert("Zm9vYmFy")).toBe("foobar");
            decoder.setOutputType(Base64OutputType.BYTES);
            expect(decoder.getOutputType()).toBe(Base64OutputType.BYTES);
            expect(decoder.convert("Zm9vYmFy")).toBe("66 6f 6f 62 61 72");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Base64Decoder(Base64OutputType.BYTES).toJSON()).toEqual({
                "type": "base64-decoder",
                "options": {
                    "output": "bytes"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new Base64Decoder().toJSON()).toEqual({
                "type": "base64-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Base64Decoder>({
                "type": "base64-decoder",
                "options": {
                    "output": "bytes"
                }
            });
            expect(converter).toEqual(jasmine.any(Base64Decoder));
            expect(converter.getOutputType()).toBe(Base64OutputType.BYTES);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<Base64Decoder>({ "type": "base64-decoder" });
            expect(converter).toEqual(jasmine.any(Base64Decoder));
            expect(converter.getOutputType()).toBe(Base64OutputType.TEXT);
        });
    });
});
