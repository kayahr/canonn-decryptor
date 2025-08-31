import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { OneTimePadDecoder } from "../../../main/decryptor/converters/OneTimePadDecoder.js";

describe("OneTimePadDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty pad if none given", () => {
            expect(new OneTimePadDecoder().getPad()).toBe("");
        });
        it("initializes to given pad", () => {
            expect(new OneTimePadDecoder("Canonn").getPad()).toBe("Canonn");
        });
        it("initializes to empty list of pad codes when no pad given", () => {
            expect(new OneTimePadDecoder().getPadCodes()).toEqual([]);
        });
        it("creates correct pad codes when pad is given", () => {
            expect(new OneTimePadDecoder("OneTimePad").getPadCodes())
                .toEqual([ 14, 13, 4, 19, 8, 12, 4, 15, 0, 3 ]);
            expect(new OneTimePadDecoder("The quick brown fox jumps over the lazy dog").getPadCodes())
                .toEqual([ 19, 7, 4, 16, 20, 8, 2, 10, 1, 17, 14, 22, 13, 5, 14, 23, 9, 20, 12, 15, 18, 14, 21, 4,
                    17, 19, 7, 4, 11, 0, 25, 24, 3, 14, 6 ]);
        });
    });

    describe("setPad", () => {
        it("updates the pad", () => {
            const decoder = new OneTimePadDecoder("Not this one");
            decoder.setPad("Canonn");
            expect(decoder.getPad()).toBe("Canonn");
        });
        it("updates the pad codes", () => {
            const decoder = new OneTimePadDecoder("Not this one");
            decoder.setPad("Canonn");
            expect(decoder.getPadCodes()).toEqual([ 2, 0, 13, 14, 13, 13 ]);
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new OneTimePadDecoder("Imperial Clipper").convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new OneTimePadDecoder("Imperial Cutter").convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencoded characters", () => {
            expect(new OneTimePadDecoder("Sidewinder").convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new OneTimePadDecoder("Eagle Mk3").convert("joumed")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new OneTimePadDecoder("Asp Explorer").convert("FGDFXG")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new OneTimePadDecoder("Anaconda").convert("FboDoe")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new OneTimePadDecoder("Cobra Mk3").convert("#12HcpSad!")).toBe("#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new OneTimePadDecoder("Secret").toJSON()).toEqual({
                type: "one-time-pad-decoder",
                options: {
                    pad: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new OneTimePadDecoder("").toJSON()).toEqual({
                type: "one-time-pad-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<OneTimePadDecoder>({
                type: "one-time-pad-decoder",
                options: {
                    pad: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(OneTimePadDecoder);
            expect(converter.getPad()).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<OneTimePadDecoder>({ type: "one-time-pad-decoder" });
            expect(converter).toBeInstanceOf(OneTimePadDecoder);
            expect(converter.getPad()).toBe("");
        });
    });
});
