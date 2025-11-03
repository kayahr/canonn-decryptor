import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { RomanEncoder } from "../../../main/decryptor/converters/RomanEncoder.ts";
import { assertEquals, assertInstanceOf } from "@kayahr/assert";

describe("RomanEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            assertEquals(new RomanEncoder().convert(""), "");
        });
        it("keeps non-decimal string", () => {
            assertEquals(new RomanEncoder().convert("not-decimal"), "not-decimal");
            assertEquals(new RomanEncoder().convert("not-decimal-1"), "not-decimal-1");
            assertEquals(new RomanEncoder().convert("1-not-decimal"), "1-not-decimal");
        });
        it("encodes single decimal numbers", () => {
            assertEquals(new RomanEncoder().convert("1"), "I");
            assertEquals(new RomanEncoder().convert("3"), "III");
            assertEquals(new RomanEncoder().convert("4"), "IV");
            assertEquals(new RomanEncoder().convert("3999"), "MMMCMXCIX");
            assertEquals(new RomanEncoder().convert("010"), "X");
        });
        it("encodes sequence of decimals", () => {
            assertEquals(new RomanEncoder().convert("9 12 50"), "IX XII L");
        });
        it("keeps white-spaces in front of decimals", () => {
            assertEquals(new RomanEncoder().convert(" 9 11"), " IX XI");
            assertEquals(new RomanEncoder().convert("  9 11"), "  IX XI");
            assertEquals(new RomanEncoder().convert("  \n9 11"), "  \nIX XI");
            assertEquals(new RomanEncoder().convert("  \n\t9 11"), "  \n\tIX XI");
        });
        it("keeps white-spaces after decimals", () => {
            assertEquals(new RomanEncoder().convert("9 11 "), "IX XI ");
            assertEquals(new RomanEncoder().convert("9 11  "), "IX XI  ");
            assertEquals(new RomanEncoder().convert("9 11\n  "), "IX XI\n  ");
            assertEquals(new RomanEncoder().convert("9 11\t\n  "), "IX XI\t\n  ");
        });
        it("keeps white-spaces between decimals", () => {
            assertEquals(new RomanEncoder().convert("9 11  11 9"), "IX XI  XI IX");
            assertEquals(new RomanEncoder().convert("9 11   11 9"), "IX XI   XI IX");
            assertEquals(new RomanEncoder().convert("9 11\n11 9"), "IX XI\nXI IX");
            assertEquals(new RomanEncoder().convert("9 11\n\t\n11 9"), "IX XI\n\t\nXI IX");
            assertEquals(new RomanEncoder().convert("9 11 \n 11 9"), "IX XI \n XI IX");
        });
        it("keeps strings between decimals", () => {
            assertEquals(new RomanEncoder().convert("before it 9 11 between it 11 9 after it"),
                "before it IX XI between it XI IX after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new RomanEncoder().toJSON(), {
                type: "roman-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<RomanEncoder>({ type: "roman-encoder" });
            assertInstanceOf(converter, RomanEncoder);
        });
    });
});
