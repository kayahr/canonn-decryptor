import { RomanDecoder } from "../../../main/decryptor/converters/RomanDecoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("RomanDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            expect(new RomanDecoder().convert("")).toEqual("");
        });
        it("keeps non-roman string", () => {
            expect(new RomanDecoder().convert("not-roman")).toEqual("not-roman");
            expect(new RomanDecoder().convert("not-roman-I")).toEqual("not-roman-I");
            expect(new RomanDecoder().convert("I-not-roman")).toEqual("I-not-roman");
        });
        it("decodes single upper-case roman number", () => {
            expect(new RomanDecoder().convert("I")).toEqual("1");
            expect(new RomanDecoder().convert("III")).toEqual("3");
            expect(new RomanDecoder().convert("IV")).toEqual("4");
        });
        it("decodes single lower-case roman number", () => {
            expect(new RomanDecoder().convert("i")).toEqual("1");
            expect(new RomanDecoder().convert("iii")).toEqual("3");
            expect(new RomanDecoder().convert("iv")).toEqual("4");
        });
        it("decodes sequence of roman numbers", () => {
            expect(new RomanDecoder().convert("IX XII L")).toEqual("9 12 50");
        });
        it("keeps white-spaces in front of roman numbers", () => {
            expect(new RomanDecoder().convert(" IX XI")).toEqual(" 9 11");
            expect(new RomanDecoder().convert("  IX XI")).toEqual("  9 11");
            expect(new RomanDecoder().convert("  \niX xI")).toEqual("  \n9 11");
            expect(new RomanDecoder().convert("  \n\tIx xI")).toEqual("  \n\t9 11");
        });
        it("keeps white-spaces after roman numbers", () => {
            expect(new RomanDecoder().convert("IX XI ")).toEqual("9 11 ");
            expect(new RomanDecoder().convert("ix xi  ")).toEqual("9 11  ");
            expect(new RomanDecoder().convert("ix XI\n  ")).toEqual("9 11\n  ");
            expect(new RomanDecoder().convert("IX XI\t\n  ")).toEqual("9 11\t\n  ");
        });
        it("keeps white-spaces between roman numbers", () => {
            expect(new RomanDecoder().convert("IX XI  XI IX")).toEqual("9 11  11 9");
            expect(new RomanDecoder().convert("IX XI   XI IX")).toEqual("9 11   11 9");
            expect(new RomanDecoder().convert("IX XI\nXI IX")).toEqual("9 11\n11 9");
            expect(new RomanDecoder().convert("IX XI\n\t\nXI IX")).toEqual("9 11\n\t\n11 9");
            expect(new RomanDecoder().convert("IX XI \n XI IX")).toEqual("9 11 \n 11 9");
        });
        it("keeps strings between roman numbers", () => {
            expect(new RomanDecoder().convert("before it IX XI between it XI IX after it")).toEqual(
                "before it 9 11 between it 11 9 after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new RomanDecoder().toJSON()).toEqual({
                "type": "roman-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<RomanDecoder>({ "type": "roman-decoder" });
            expect(converter).toEqual(jasmine.any(RomanDecoder));
        });
    });
});
