import { describe, expect, it } from "vitest";

import { Converter } from "../../../main/decryptor/converters/Converter.js";
import { OneTimePadEncoder } from "../../../main/decryptor/converters/OneTimePadEncoder.js";

describe("OneTimePadEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty pad if none given", () => {
            expect(new OneTimePadEncoder().pad).toBe("");
        });
        it("initializes to given pad", () => {
            expect(new OneTimePadEncoder({ pad: "Canonn" }).pad).toBe("Canonn");
        });
        it("initializes to empty list of pad codes when no pad given", () => {
            expect(new OneTimePadEncoder().getPadCodes()).toEqual([]);
        });
        it("creates correct pad codes list when pad is given", () => {
            expect(new OneTimePadEncoder({ pad: "a 14,.- ez " }).getPadCodes()).toEqual([ 0, 4, 25 ]);
        });
    });

    describe("setPad", () => {
        it("updates the pad", () => {
            const encoder = new OneTimePadEncoder({ pad: "Not this one" });
            encoder.pad = "Canonn";
            expect(encoder.pad).toBe("Canonn");
        });
        it("updates the pad codes", () => {
            const encoder = new OneTimePadEncoder({ pad: "Not this one" });
            encoder.pad = "Canonn";
            expect(encoder.getPadCodes()).toEqual([ 2, 0, 13, 14, 13, 13 ]);
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new OneTimePadEncoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new OneTimePadEncoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencodable characters", () => {
            expect(new OneTimePadEncoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            expect(new OneTimePadEncoder({ pad: "Eagle Mk3" }).convert("foobar")).toBe("joumed");
        });
        it("encodes normal upper-case characters", () => {
            expect(new OneTimePadEncoder({ pad: "Asp Explorer" }).convert("FOOBAR")).toBe("FGDFXG");
        });
        it("encodes normal mixed-case characters", () => {
            expect(new OneTimePadEncoder({ pad: "Anaconda" }).convert("FooBar")).toBe("FboDoe");
        });
        it("encodes only normal characters in mixed string", () => {
            expect(new OneTimePadEncoder({ pad: "Cobra Mk3" }).convert("#12FooBar!")).toBe("#12HcpSad!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new OneTimePadEncoder({ pad: "Secret" }).toJSON()).toEqual({
                type: "one-time-pad-encoder",
                options: {
                    pad: "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new OneTimePadEncoder({ pad: "" }).toJSON()).toEqual({
                type: "one-time-pad-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<OneTimePadEncoder>({
                type: "one-time-pad-encoder",
                options: {
                    pad: "Secret"
                }
            });
            expect(converter).toBeInstanceOf(OneTimePadEncoder);
            expect(converter.pad).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<OneTimePadEncoder>({ type: "one-time-pad-encoder" });
            expect(converter).toBeInstanceOf(OneTimePadEncoder);
            expect(converter.pad).toBe("");
        });
    });
});
