import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { RomanDecoder } from "../../../main/decryptor/converters/RomanDecoder.ts";
import { assertEquals, assertInstanceOf } from "@kayahr/assert";

describe("RomanDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            assertEquals(new RomanDecoder().convert(""), "");
        });
        it("keeps non-roman string", () => {
            assertEquals(new RomanDecoder().convert("not-roman"), "not-roman");
            assertEquals(new RomanDecoder().convert("not-roman-I"), "not-roman-I");
            assertEquals(new RomanDecoder().convert("I-not-roman"), "I-not-roman");
        });
        it("decodes single upper-case roman number", () => {
            assertEquals(new RomanDecoder().convert("I"), "1");
            assertEquals(new RomanDecoder().convert("III"), "3");
            assertEquals(new RomanDecoder().convert("IV"), "4");
        });
        it("decodes single lower-case roman number", () => {
            assertEquals(new RomanDecoder().convert("i"), "1");
            assertEquals(new RomanDecoder().convert("iii"), "3");
            assertEquals(new RomanDecoder().convert("iv"), "4");
        });
        it("decodes sequence of roman numbers", () => {
            assertEquals(new RomanDecoder().convert("IX XII L"), "9 12 50");
        });
        it("keeps white-spaces in front of roman numbers", () => {
            assertEquals(new RomanDecoder().convert(" IX XI"), " 9 11");
            assertEquals(new RomanDecoder().convert("  IX XI"), "  9 11");
            assertEquals(new RomanDecoder().convert("  \niX xI"), "  \n9 11");
            assertEquals(new RomanDecoder().convert("  \n\tIx xI"), "  \n\t9 11");
        });
        it("keeps white-spaces after roman numbers", () => {
            assertEquals(new RomanDecoder().convert("IX XI "), "9 11 ");
            assertEquals(new RomanDecoder().convert("ix xi  "), "9 11  ");
            assertEquals(new RomanDecoder().convert("ix XI\n  "), "9 11\n  ");
            assertEquals(new RomanDecoder().convert("IX XI\t\n  "), "9 11\t\n  ");
        });
        it("keeps white-spaces between roman numbers", () => {
            assertEquals(new RomanDecoder().convert("IX XI  XI IX"), "9 11  11 9");
            assertEquals(new RomanDecoder().convert("IX XI   XI IX"), "9 11   11 9");
            assertEquals(new RomanDecoder().convert("IX XI\nXI IX"), "9 11\n11 9");
            assertEquals(new RomanDecoder().convert("IX XI\n\t\nXI IX"), "9 11\n\t\n11 9");
            assertEquals(new RomanDecoder().convert("IX XI \n XI IX"), "9 11 \n 11 9");
        });
        it("keeps strings between roman numbers", () => {
            assertEquals(new RomanDecoder().convert("before it IX XI between it XI IX after it"),
                "before it 9 11 between it 11 9 after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new RomanDecoder().toJSON(), {
                type: "roman-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<RomanDecoder>({ type: "roman-decoder" });
            assertInstanceOf(converter, RomanDecoder);
        });
    });
});
