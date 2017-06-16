import { RomanEncoder } from "../../../main/decryptor/converters/RomanEncoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("RomanEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            expect(new RomanEncoder().convert("")).toEqual("");
        });
        it("keeps non-decimal string", () => {
            expect(new RomanEncoder().convert("not-decimal")).toEqual("not-decimal");
            expect(new RomanEncoder().convert("not-decimal-1")).toEqual("not-decimal-1");
            expect(new RomanEncoder().convert("1-not-decimal")).toEqual("1-not-decimal");
        });
        it("encodes single decimal numbers", () => {
            expect(new RomanEncoder().convert("1")).toEqual("I");
            expect(new RomanEncoder().convert("3")).toEqual("III");
            expect(new RomanEncoder().convert("4")).toEqual("IV");
            expect(new RomanEncoder().convert("3999")).toEqual("MMMCMXCIX");
            expect(new RomanEncoder().convert("010")).toEqual("X");
        });
        it("encodes sequence of decimals", () => {
            expect(new RomanEncoder().convert("9 12 50")).toEqual("IX XII L");
        });
        it("keeps white-spaces in front of decimals", () => {
            expect(new RomanEncoder().convert(" 9 11")).toEqual(" IX XI");
            expect(new RomanEncoder().convert("  9 11")).toEqual("  IX XI");
            expect(new RomanEncoder().convert("  \n9 11")).toEqual("  \nIX XI");
            expect(new RomanEncoder().convert("  \n\t9 11")).toEqual("  \n\tIX XI");
        });
        it("keeps white-spaces after decimals", () => {
            expect(new RomanEncoder().convert("9 11 ")).toEqual("IX XI ");
            expect(new RomanEncoder().convert("9 11  ")).toEqual("IX XI  ");
            expect(new RomanEncoder().convert("9 11\n  ")).toEqual("IX XI\n  ");
            expect(new RomanEncoder().convert("9 11\t\n  ")).toEqual("IX XI\t\n  ");
        });
        it("keeps white-spaces between decimals", () => {
            expect(new RomanEncoder().convert("9 11  11 9")).toEqual("IX XI  XI IX");
            expect(new RomanEncoder().convert("9 11   11 9")).toEqual("IX XI   XI IX");
            expect(new RomanEncoder().convert("9 11\n11 9")).toEqual("IX XI\nXI IX");
            expect(new RomanEncoder().convert("9 11\n\t\n11 9")).toEqual("IX XI\n\t\nXI IX");
            expect(new RomanEncoder().convert("9 11 \n 11 9")).toEqual("IX XI \n XI IX");
        });
        it("keeps strings between decimals", () => {
            expect(new RomanEncoder().convert("before it 9 11 between it 11 9 after it")).toEqual(
                "before it IX XI between it XI IX after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new RomanEncoder().toJSON()).toEqual({
                "type": "roman-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<RomanEncoder>({ "type": "roman-encoder" });
            expect(converter).toEqual(jasmine.any(RomanEncoder));
        });
    });
});
