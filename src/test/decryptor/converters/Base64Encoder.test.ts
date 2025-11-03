import { describe, it } from "node:test";

import { Base64Encoder } from "../../../main/decryptor/converters/Base64Encoder.ts";
import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("Base64Encoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            assertSame(new Base64Encoder().convert(""), "");
        });
        it("encodes UTF-8 to base64", () => {
            assertSame(new Base64Encoder().convert("foobar öäüß"), "Zm9vYmFyIMO2w6TDvMOf");
        });
        it("adds line breaks after 76 characters", () => {
            assertSame(new Base64Encoder().convert(
                "The Imperial Clipper is the quintessential Imperial ship. It epitomises elegance of form "
                + "while delivering speed and agility."
            ), "VGhlIEltcGVyaWFsIENsaXBwZXIgaXMgdGhlIHF1aW50ZXNzZW50aWFsIEltcGVyaWFsIHNoaXAu\n"
                + "IEl0IGVwaXRvbWlzZXMgZWxlZ2FuY2Ugb2YgZm9ybSB3aGlsZSBkZWxpdmVyaW5nIHNwZWVkIGFu\n"
                + "ZCBhZ2lsaXR5Lg=="
            );
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new Base64Encoder().toJSON(), {
                type: "base64-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Base64Encoder>({
                type: "base64-encoder"
            });
            assertInstanceOf(converter, Base64Encoder);
        });
    });
});
