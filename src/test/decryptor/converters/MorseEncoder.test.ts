import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { MorseEncoder } from "../../../main/decryptor/converters/MorseEncoder.js";

describe("MorseEncoder", () => {
    describe("convert", () => {
        it("encodes empty string into empty string", () => {
            expect(new MorseEncoder().convert("")).toEqual("");
        });
        it("keeps characters with no morse equivalent", () => {
            expect(new MorseEncoder().convert("<%>")).toEqual("<%>");
        });
        it("encodes single characters into morse code", () => {
            expect(new MorseEncoder().convert("E")).toEqual(".");
            expect(new MorseEncoder().convert("T")).toEqual("-");
            expect(new MorseEncoder().convert("S")).toEqual("...");
            expect(new MorseEncoder().convert("O")).toEqual("---");
        });
        it("encodes lower-case characters as well", () => {
            expect(new MorseEncoder().convert("e")).toEqual(".");
            expect(new MorseEncoder().convert("t")).toEqual("-");
            expect(new MorseEncoder().convert("s")).toEqual("...");
            expect(new MorseEncoder().convert("o")).toEqual("---");
        });
        it("encodes sequence of characters to morse", () => {
            expect(new MorseEncoder().convert("ESO")).toEqual(". ... ---");
        });
        it("keeps white-spaces in front of text. A trailing tab is replaced by a space.", () => {
            expect(new MorseEncoder().convert(" AN")).toEqual(" .- -.");
            expect(new MorseEncoder().convert("  AN")).toEqual("  .- -.");
            expect(new MorseEncoder().convert("  \nAN")).toEqual("  \n.- -.");
            expect(new MorseEncoder().convert("  \n\tAN")).toEqual("  \n .- -.");
            expect(new MorseEncoder().convert("  \n\t\tAN")).toEqual("  \n\t .- -.");
        });
        it("keeps white-spaces after text. A Leading tab is replaced by a space.", () => {
            expect(new MorseEncoder().convert("AN ")).toEqual(".- -. ");
            expect(new MorseEncoder().convert("AN  ")).toEqual(".- -.  ");
            expect(new MorseEncoder().convert("AN\n  ")).toEqual(".- -.\n  ");
            expect(new MorseEncoder().convert("AN\t\n  ")).toEqual(".- -. \n  ");
            expect(new MorseEncoder().convert("AN\t\t\n  ")).toEqual(".- -. \t\n  ");
        });
        it("keeps white-spaces between text", () => {
            expect(new MorseEncoder().convert("AN NA")).toEqual(".- -.  -. .-");
            expect(new MorseEncoder().convert("AN  NA")).toEqual(".- -.   -. .-");
            expect(new MorseEncoder().convert("AN\nNA")).toEqual(".- -.\n-. .-");
            expect(new MorseEncoder().convert("AN\n\t\nNA")).toEqual(".- -.\n\t\n-. .-");
            expect(new MorseEncoder().convert("AN \n NA")).toEqual(".- -. \n -. .-");
        });
        it("keeps untranslatable characters between translatable ones", () => {
            expect(new MorseEncoder().convert("<AN><NA>")).toEqual("< .- -. >< -. .- >");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new MorseEncoder({ dot: "*", dash: "#" }).toJSON()).toEqual({
                type: "morse-encoder",
                options: {
                    dot: "*",
                    dash: "#"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new MorseEncoder().toJSON()).toEqual({ type: "morse-encoder" });
            expect(new MorseEncoder({ dot: "*" }).toJSON()).toEqual({
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
            expect(converter).toBeInstanceOf(MorseEncoder);
            expect(converter.dot).toBe("*");
            expect(converter.dash).toBe("#");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<MorseEncoder>({ type: "morse-encoder" });
            expect(converter).toBeInstanceOf(MorseEncoder);
            expect(converter.dot).toBe(".");
            expect(converter.dash).toBe("-");
        });
    });
});
