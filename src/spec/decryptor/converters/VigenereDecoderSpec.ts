import { VigenereDecoder } from "../../../main/decryptor/converters/VigenereDecoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("VigenereDecoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new VigenereDecoder().getKeyword()).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new VigenereDecoder("Canonn").getKeyword()).toBe("Canonn");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const decoder = new VigenereDecoder("Not this one");
            decoder.setKeyword("Canonn");
            expect(decoder.getKeyword()).toBe("Canonn");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new VigenereDecoder("Imperial Clipper").convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new VigenereDecoder("Imperial Cutter").convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencoded characters", () => {
            expect(new VigenereDecoder("Sidewinder").convert("1ö_<")).toBe("1ö_<");
        });
        it("decodes normal lower-case characters", () => {
            expect(new VigenereDecoder("Eagle Mk3").convert("joumed")).toBe("foobar");
        });
        it("decodes normal upper-case characters", () => {
            expect(new VigenereDecoder("Asp Explorer").convert("FGDFXG")).toBe("FOOBAR");
        });
        it("decodes normal mixed-case characters", () => {
            expect(new VigenereDecoder("Anaconda").convert("FboDoe")).toBe("FooBar");
        });
        it("decodes only normal characters in mixed string", () => {
            expect(new VigenereDecoder("Cobra Mk3").convert("#12HcpSad!")).toBe("#12FooBar!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new VigenereDecoder("Secret").toJSON()).toEqual({
                "type": "vigenere-decoder",
                "options": {
                    "keyword": "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new VigenereDecoder("").toJSON()).toEqual({
                "type": "vigenere-decoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<VigenereDecoder>({
                "type": "vigenere-decoder",
                "options": {
                    "keyword": "Secret"
                }
            });
            expect(converter).toEqual(jasmine.any(VigenereDecoder));
            expect(converter.getKeyword()).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<VigenereDecoder>({ "type": "vigenere-decoder" });
            expect(converter).toEqual(jasmine.any(VigenereDecoder));
            expect(converter.getKeyword()).toBe("");
        });
    });
});
