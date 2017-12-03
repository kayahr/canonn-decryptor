import { Atbash } from "../../../main/decryptor/converters/Atbash";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("Atbash", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Atbash().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new Atbash().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps non-alphabet characters", () => {
            expect(new Atbash().convert("1ö_<")).toBe("1ö_<");
        });
        it("converts normal lower-case characters", () => {
            expect(new Atbash().convert("foobar")).toBe("ullyzi");
        });
        it("converts normal upper-case characters", () => {
            expect(new Atbash().convert("FOOBAR")).toBe("ULLYZI");
        });
        it("converts normal mixed-case characters", () => {
            expect(new Atbash().convert("FooBar")).toBe("UllYzi");
        });
        it("converts only normal characters in mixed string", () => {
            expect(new Atbash().convert("#12FooBar!")).toBe("#12UllYzi!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Atbash().toJSON()).toEqual({
                "type": "atbash"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<Atbash>({ "type": "atbash" });
            expect(converter).toEqual(jasmine.any(Atbash));
        });
    });
});
