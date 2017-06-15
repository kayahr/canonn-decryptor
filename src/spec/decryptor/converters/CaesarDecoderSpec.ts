import { CaesarDecoder } from "../../../main/decryptor/converters/CaesarDecoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("CaesarDecoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new CaesarDecoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new CaesarDecoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unrotated characters", () => {
            expect(new CaesarDecoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new CaesarDecoder(21).convert("kttgfw")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new CaesarDecoder(14).convert("RAANMD")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new CaesarDecoder(1).convert("EnnAzq")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new CaesarDecoder(19).convert("#12MvvIhy!")).toBe("#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new CaesarDecoder(15).toJSON()).toEqual({
                "type": "caesar-decoder",
                "options": {
                    "rotation": 15
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new CaesarDecoder(13).toJSON()).toEqual({
                "type": "caesar-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<CaesarDecoder>({
                "type": "caesar-decoder",
                "options": {
                    "rotation": 15
                }
            });
            expect(converter).toEqual(jasmine.any(CaesarDecoder));
            expect(converter.getRotation()).toBe(15);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<CaesarDecoder>({ "type": "caesar-decoder" });
            expect(converter).toEqual(jasmine.any(CaesarDecoder));
            expect(converter.getRotation()).toBe(13);
        });
    });
});
