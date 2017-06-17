import { CaesarEncoder } from "../../../main/decryptor/converters/CaesarEncoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("CaesarEncoder", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new CaesarEncoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new CaesarEncoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unrotatable characters", () => {
            expect(new CaesarEncoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            expect(new CaesarEncoder(5).convert("foobar")).toBe("kttgfw");
        });
        it("encodes normal upper-case characters", () => {
            expect(new CaesarEncoder(12).convert("FOOBAR")).toBe("RAANMD");
        });
        it("encodes normal mixed-case characters", () => {
            expect(new CaesarEncoder(25).convert("FooBar")).toBe("EnnAzq");
        });
        it("encodes only normal characters in mixed string", () => {
            expect(new CaesarEncoder(7).convert("#12FooBar!")).toBe("#12MvvIhy!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new CaesarEncoder(12).toJSON()).toEqual({
                "type": "caesar-encoder",
                "options": {
                    "rotation": 12
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new CaesarEncoder(13).toJSON()).toEqual({
                "type": "caesar-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<CaesarEncoder>({
                "type": "caesar-encoder",
                "options": {
                    "rotation": 11
                }
            });
            expect(converter).toEqual(jasmine.any(CaesarEncoder));
            expect(converter.getRotation()).toBe(11);
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<CaesarEncoder>({ "type": "caesar-encoder" });
            expect(converter).toEqual(jasmine.any(CaesarEncoder));
            expect(converter.getRotation()).toBe(13);
        });
    });
});
