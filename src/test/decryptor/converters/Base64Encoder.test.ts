import { describe, expect, it } from "vitest";

import { Base64Encoder } from "../../../main/decryptor/converters/Base64Encoder.js";
import { Converter } from "../../../main/decryptor/converters/Converter.js";

describe("Base64Encoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Base64Encoder().convert("")).toBe("");
        });
        it("encodes UTF-8 to base64", () => {
            expect(new Base64Encoder().convert("foobar öäüß")).toBe("Zm9vYmFyIMO2w6TDvMOf");
        });
        it("adds line breaks after 76 characters", () => {
            expect(new Base64Encoder()
                .convert(
                    "The Imperial Clipper is the quintessential Imperial ship. It epitomises elegance of form "
                    + "while delivering speed and agility.")
                ).toBe(
                    "VGhlIEltcGVyaWFsIENsaXBwZXIgaXMgdGhlIHF1aW50ZXNzZW50aWFsIEltcGVyaWFsIHNoaXAu\n"
                    + "IEl0IGVwaXRvbWlzZXMgZWxlZ2FuY2Ugb2YgZm9ybSB3aGlsZSBkZWxpdmVyaW5nIHNwZWVkIGFu\n"
                    + "ZCBhZ2lsaXR5Lg=="
                );
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Base64Encoder().toJSON()).toEqual({
                type: "base64-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Base64Encoder>({
                type: "base64-encoder"
            });
            expect(converter).toBeInstanceOf(Base64Encoder);
        });
    });
});
