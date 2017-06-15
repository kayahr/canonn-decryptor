import { MorseDecoder } from "../../../main/decryptor/converters/MorseDecoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("MorseDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            expect(new MorseDecoder().convert("")).toEqual("");
        });
        it("keeps non-morse string", () => {
            expect(new MorseDecoder().convert("not-morse")).toEqual("not-morse");
            expect(new MorseDecoder().convert("not_.")).toEqual("not_.");
            expect(new MorseDecoder().convert("_.nope")).toEqual("_.nope");
        });
        it("decodes single morse codes", () => {
            expect(new MorseDecoder().convert(".")).toEqual("E");
            expect(new MorseDecoder().convert("-")).toEqual("T");
            expect(new MorseDecoder().convert("...")).toEqual("S");
            expect(new MorseDecoder().convert("---")).toEqual("O");
        });
        it("can decode different kinds of morse characters", () => {
            expect(new MorseDecoder().convert(".*")).toEqual("I");
            expect(new MorseDecoder().convert("-__")).toEqual("O");
        });
        it("decodes sequence of morse codes", () => {
            expect(new MorseDecoder().convert(". ... ---")).toEqual("ESO");
        });
        it("keeps white-spaces in front of morse codes", () => {
            expect(new MorseDecoder().convert(" .- -.")).toEqual( " AN");
            expect(new MorseDecoder().convert("  .- -.")).toEqual( "  AN");
            expect(new MorseDecoder().convert("  \n.- -.")).toEqual("  \nAN");
            expect(new MorseDecoder().convert("  \n\t.- -.")).toEqual("  \n\tAN");
        });
        it("keeps white-spaces after morse codes", () => {
            expect(new MorseDecoder().convert(".- -. ")).toEqual("AN ");
            expect(new MorseDecoder().convert(".- -.  ")).toEqual("AN  ");
            expect(new MorseDecoder().convert(".- -.\n  ")).toEqual("AN\n  ");
            expect(new MorseDecoder().convert(".- -.\t\n  ")).toEqual("AN\t\n  ");
        });
        it("keeps white-spaces between morse codes but trims a leading space character", () => {
            expect(new MorseDecoder().convert(".- -.  -. .-")).toEqual("AN NA");
            expect(new MorseDecoder().convert(".- -.   -. .-")).toEqual("AN  NA");
            expect(new MorseDecoder().convert(".- -.\n-. .-")).toEqual("AN\nNA");
            expect(new MorseDecoder().convert(".- -.\n\t\n-. .-")).toEqual("AN\n\t\nNA");
            expect(new MorseDecoder().convert(".- -. \n -. .-")).toEqual("AN\n NA");
        });
        it("keeps strings between morse codes", () => {
            expect(new MorseDecoder().convert("before it .- -. between it -. .- after it")).toEqual(
                "before it AN between it NA after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new MorseDecoder("o*", "-#").toJSON()).toEqual({
                "type": "morse-decoder",
                "options": {
                    "dots": "o*",
                    "dashes": "-#"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new MorseDecoder().toJSON()).toEqual({ "type": "morse-decoder" });
            expect(new MorseDecoder("*o").toJSON()).toEqual({
                "type": "morse-decoder",
                "options": { "dots": "*o" }
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<MorseDecoder>({
                "type": "morse-decoder",
                "options": {
                    "dots": "*o",
                    "dashes": "#~"
                }
            });
            expect(converter).toEqual(jasmine.any(MorseDecoder));
            expect(converter.getDots()).toBe("*o");
            expect(converter.getDashes()).toBe("#~");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<MorseDecoder>({ "type": "morse-decoder" });
            expect(converter).toEqual(jasmine.any(MorseDecoder));
            expect(converter.getDots()).toBe(".·*");
            expect(converter.getDashes()).toBe("_-−");
        });
    });
});
