import { describe, it } from "node:test";

import { Converter } from "../../../main/decryptor/converters/Converter.ts";
import { MorseDecoder } from "../../../main/decryptor/converters/MorseDecoder.ts";
import { assertEquals, assertInstanceOf, assertSame } from "@kayahr/assert";

describe("MorseDecoder", () => {
    describe("convert", () => {
        it("decodes empty string into empty string", () => {
            assertEquals(new MorseDecoder().convert(""), "");
        });
        it("keeps non-morse string", () => {
            assertEquals(new MorseDecoder().convert("not-morse"), "not-morse");
            assertEquals(new MorseDecoder().convert("not_."), "not_.");
            assertEquals(new MorseDecoder().convert("_.nope"), "_.nope");
        });
        it("decodes single morse codes", () => {
            assertEquals(new MorseDecoder().convert("."), "E");
            assertEquals(new MorseDecoder().convert("-"), "T");
            assertEquals(new MorseDecoder().convert("..."), "S");
            assertEquals(new MorseDecoder().convert("---"), "O");
        });
        it("can decode different kinds of morse characters", () => {
            assertEquals(new MorseDecoder().convert(".*"), "I");
            assertEquals(new MorseDecoder().convert("-__"), "O");
        });
        it("decodes sequence of morse codes", () => {
            assertEquals(new MorseDecoder().convert(". ... ---"), "ESO");
        });
        it("keeps white-spaces in front of morse codes", () => {
            assertEquals(new MorseDecoder().convert(" .- -."), " AN");
            assertEquals(new MorseDecoder().convert("  .- -."), "  AN");
            assertEquals(new MorseDecoder().convert("  \n.- -."), "  \nAN");
            assertEquals(new MorseDecoder().convert("  \n\t.- -."), "  \n\tAN");
        });
        it("keeps white-spaces after morse codes", () => {
            assertEquals(new MorseDecoder().convert(".- -. "), "AN ");
            assertEquals(new MorseDecoder().convert(".- -.  "), "AN  ");
            assertEquals(new MorseDecoder().convert(".- -.\n  "), "AN\n  ");
            assertEquals(new MorseDecoder().convert(".- -.\t\n  "), "AN\t\n  ");
        });
        it("keeps white-spaces between morse codes but trims a leading space character", () => {
            assertEquals(new MorseDecoder().convert(".- -.  -. .-"), "AN NA");
            assertEquals(new MorseDecoder().convert(".- -.   -. .-"), "AN  NA");
            assertEquals(new MorseDecoder().convert(".- -.\n-. .-"), "AN\nNA");
            assertEquals(new MorseDecoder().convert(".- -.\n\t\n-. .-"), "AN\n\t\nNA");
            assertEquals(new MorseDecoder().convert(".- -. \n -. .-"), "AN \n NA");
        });
        it("keeps strings between morse codes", () => {
            assertEquals(new MorseDecoder().convert("before it .- -. between it -. .- after it"),
                "before it AN between it NA after it");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            assertEquals(new MorseDecoder({ dots: "o*", dashes: "-#" }).toJSON(), {
                type: "morse-decoder",
                options: {
                    dots: "o*",
                    dashes: "-#"
                }
            });
        });
        it("does not serialize default option values", () => {
            assertEquals(new MorseDecoder().toJSON(), { type: "morse-decoder" });
            assertEquals(new MorseDecoder({ dots: "*o" }).toJSON(), {
                type: "morse-decoder",
                options: { dots: "*o" }
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<MorseDecoder>({
                type: "morse-decoder",
                options: {
                    dots: "*o",
                    dashes: "#~"
                }
            });
            assertInstanceOf(converter, MorseDecoder);
            assertSame(converter.dots, "*o");
            assertSame(converter.dashes, "#~");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<MorseDecoder>({ type: "morse-decoder" });
            assertInstanceOf(converter, MorseDecoder);
            assertSame(converter.dots, ".·*");
            assertSame(converter.dashes, "_-−");
        });
    });
});
