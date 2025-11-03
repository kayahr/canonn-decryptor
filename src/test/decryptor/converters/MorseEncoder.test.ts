import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { MorseEncoder } from "../../../main/decryptor/converters/MorseEncoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("MorseEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            assertEquals(new MorseEncoder().convert(""), "");
        });
        it("keeps characters with no morse equivalent", () => {
            assertEquals(new MorseEncoder().convert("<%>"), "<%>");
        });
        it("encodes single characters into morse code", () => {
            assertEquals(new MorseEncoder().convert("E"), ".");
            assertEquals(new MorseEncoder().convert("T"), "-");
            assertEquals(new MorseEncoder().convert("S"), "...");
            assertEquals(new MorseEncoder().convert("O"), "---");
        });
        it("encodes lower-case characters as well", () => {
            assertEquals(new MorseEncoder().convert("e"), ".");
            assertEquals(new MorseEncoder().convert("t"), "-");
            assertEquals(new MorseEncoder().convert("s"), "...");
            assertEquals(new MorseEncoder().convert("o"), "---");
        });
        it("encodes sequence of characters to morse", () => {
            assertEquals(new MorseEncoder().convert("ESO"), ". ... ---");
        });
        it("keeps white-spaces in front of text. A trailing tab is replaced by a space.", () => {
            assertEquals(new MorseEncoder().convert(" AN"), " .- -.");
            assertEquals(new MorseEncoder().convert("  AN"), "  .- -.");
            assertEquals(new MorseEncoder().convert("  \nAN"), "  \n.- -.");
            assertEquals(new MorseEncoder().convert("  \n\tAN"), "  \n .- -.");
            assertEquals(new MorseEncoder().convert("  \n\t\tAN"), "  \n\t .- -.");
        });
        it("keeps white-spaces after text. A Leading tab is replaced by a space.", () => {
            assertEquals(new MorseEncoder().convert("AN "), ".- -. ");
            assertEquals(new MorseEncoder().convert("AN  "), ".- -.  ");
            assertEquals(new MorseEncoder().convert("AN\n  "), ".- -.\n  ");
            assertEquals(new MorseEncoder().convert("AN\t\n  "), ".- -. \n  ");
            assertEquals(new MorseEncoder().convert("AN\t\t\n  "), ".- -. \t\n  ");
        });
        it("keeps white-spaces between text", () => {
            assertEquals(new MorseEncoder().convert("AN NA"), ".- -.  -. .-");
            assertEquals(new MorseEncoder().convert("AN  NA"), ".- -.   -. .-");
            assertEquals(new MorseEncoder().convert("AN\nNA"), ".- -.\n-. .-");
            assertEquals(new MorseEncoder().convert("AN\n\t\nNA"), ".- -.\n\t\n-. .-");
            assertEquals(new MorseEncoder().convert("AN \n NA"), ".- -. \n -. .-");
        });
        it("keeps untranslatable characters between translatable ones", () => {
            assertEquals(new MorseEncoder().convert("<AN><NA>"), "< .- -. >< -. .- >");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new MorseEncoder({ dot: "*", dash: "#" }).toJSON(), {
                type: "morse-encoder",
                options: {
                    dot: "*",
                    dash: "#"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new MorseEncoder().toJSON(), { type: "morse-encoder" });
            assertEquals(new MorseEncoder({ dot: "*" }).toJSON(), {
                type: "morse-encoder",
                options: { dot: "*" }
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<MorseEncoder>({
                type: "morse-encoder",
                options: {
                    dot: "*",
                    dash: "#"
                }
            });
            assertInstanceOf(converter, MorseEncoder);
            assertSame(converter.dot, "*");
            assertSame(converter.dash, "#");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<MorseEncoder>({ type: "morse-encoder" });
            assertInstanceOf(converter, MorseEncoder);
            assertSame(converter.dot, ".");
            assertSame(converter.dash, "-");
        });
    });
});
