import { Rot13 } from "../../../main/decryptor/converters/Rot13";

describe("Rot13", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Rot13().convert("")).toBe("");
        });
        it("keeps white-space only string", () => {
            expect(new Rot13().convert(" \n\r\t")).toBe(" \n\r\t");
        });
        it("keeps unrotated characters", () => {
            expect(new Rot13().convert("1ö_<")).toBe("1ö_<");
        });
        it("rotates normal lower-case characters", () => {
            expect(new Rot13().convert("foobar")).toBe("sbbone");
        });
        it("rotates normal upper-case characters", () => {
            expect(new Rot13().convert("FOOBAR")).toBe("SBBONE");
        });
        it("rotates normal mixed-case characters", () => {
            expect(new Rot13().convert("FooBar")).toBe("SbbOne");
        });
        it("rotates only normal characters in mixed string", () => {
            expect(new Rot13().convert("#12FooBar!")).toBe("#12SbbOne!");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Rot13().toJSON()).toEqual({
                "type": "rot13"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = <Rot13>Rot13.fromJSON({ "type": "rot13" });
            expect(converter).toEqual(jasmine.any(Rot13));
        });
    });
});
