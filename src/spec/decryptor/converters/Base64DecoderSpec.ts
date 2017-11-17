import { Base64Encoder } from "../../../main/decryptor/converters/Base64Encoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("Base64Encoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Base64Encoder().convert("")).toBe("");
        });
        it("decodes valid base64 to UTF-8 text", () => {
            expect(new Base64Encoder().convert("foobar öäüß")).toBe("Zm9vYmFyIMO2w6TDvMOf");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Base64Encoder().toJSON()).toEqual({
                "type": "base64-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Base64Encoder>({
                "type": "base64-encoder"
            });
            expect(converter).toEqual(jasmine.any(Base64Encoder));
        });
    });
});
