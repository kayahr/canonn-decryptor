import { KeywordEncoder } from "../../../main/decryptor/converters/KeywordEncoder";
import { Converter } from "../../../main/decryptor/converters/Converter";

describe("KeywordEncoder", () => {
    describe("constructor", () => {
        it("initializes to empty keyword if none given", () => {
            expect(new KeywordEncoder().getKeyword()).toBe("");
        });
        it("initializes to given keyword", () => {
            expect(new KeywordEncoder("Canonn").getKeyword()).toBe("Canonn");
        });
        it("initializes to standard alphabet when no keyword given", () => {
            expect(new KeywordEncoder().getAlphabet()).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        });
        it("creates correct alphabet when keyword is given", () => {
            expect(new KeywordEncoder("Keyword").getAlphabet())
                .toBe("KEYWORDABCFGHIJLMNPQSTUVXZ");
            expect(new KeywordEncoder("The quick brown fox jumps over the lazy dog").getAlphabet())
                .toBe("THEQUICKBROWNFXJMPSVLAZYDG");
        });
    });

    describe("setKeyword", () => {
        it("updates the keyword", () => {
            const encoder = new KeywordEncoder("Not this one");
            encoder.setKeyword("Canonn");
            expect(encoder.getKeyword()).toBe("Canonn");
        });
        it("updates the alphabet", () => {
            const encoder = new KeywordEncoder("Not this one");
            encoder.setKeyword("Canonn");
            expect(encoder.getAlphabet()).toBe("CANOBDEFGHIJKLMPQRSTUVWXYZ");
        });
    });

    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new KeywordEncoder().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new KeywordEncoder().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unencodable characters", () => {
            expect(new KeywordEncoder().convert("1ö_<")).toBe("1ö_<");
        });
        it("encodes normal lower-case characters", () => {
            expect(new KeywordEncoder("Eagle Mk3").convert("foobar")).toBe("kooaer");
        });
        it("encodes normal upper-case characters", () => {
            expect(new KeywordEncoder("Asp Explorer").convert("FOOBAR")).toBe("LIISAM");
        });
        it("encodes normal mixed-case characters", () => {
            expect(new KeywordEncoder("Anaconda").convert("FooBar")).toBe("BmmNar");
        });
        it("encodes only normal characters in mixed string", () => {
            expect(new KeywordEncoder("Cobra Mk3").convert("#12FooBar!")).toBe("#12MllOcq!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new KeywordEncoder("Secret").toJSON()).toEqual({
                "type": "keyword-encoder",
                "options": {
                    "keyword": "Secret"
                }
            });
        });
        it("does not serialize default option values", () => {
            expect(new KeywordEncoder("").toJSON()).toEqual({
                "type": "keyword-encoder"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = Converter.fromJSON<KeywordEncoder>({
                "type": "keyword-encoder",
                "options": {
                    "keyword": "Secret"
                }
            });
            expect(converter).toEqual(jasmine.any(KeywordEncoder));
            expect(converter.getKeyword()).toBe("Secret");
        });
        it("deserializes a converter with default options", () => {
            const converter = Converter.fromJSON<KeywordEncoder>({ "type": "keyword-encoder" });
            expect(converter).toEqual(jasmine.any(KeywordEncoder));
            expect(converter.getKeyword()).toBe("");
        });
    });
});
