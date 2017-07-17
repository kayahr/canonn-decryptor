import { Reverse } from "../../../main/decryptor/converters/Reverse";

describe("Reverse", () => {
    describe("convert", () => {
        it("converts empty string to empty string", () => {
            expect(new Reverse().convert("")).toBe("");
        });
        it("reverses normal lower-case characters", () => {
            expect(new Reverse().convert("foobar")).toBe("raboof");
        });
        it("reverses normal upper-case characters", () => {
            expect(new Reverse().convert("FOOBAR")).toBe("RABOOF");
        });
        it("reverses mixed-case characters", () => {
            expect(new Reverse().convert("FooBar")).toBe("raBooF");
        });
        it("reverses non-alphabet characters", () => {
            expect(new Reverse().convert("1ö_<")).toBe("<_ö1");
        });
        it("reverses mixed strings", () => {
            expect(new Reverse().convert("#12FooBar!")).toBe("!raBooF21#");
        });
        it("reverses multiple lines", () => {
            expect(new Reverse().convert("Line 1\nLine 2\nLine 3")).toBe("3 eniL\n2 eniL\n1 eniL");
        });
        it("reverses multiple lines but does not reverse CRLF or LFCR sequences", () => {
            expect(new Reverse().convert("Line 1\r\nLine 2\n\rLine 3")).toBe("3 eniL\n\r2 eniL\r\n1 eniL");
        });
    });

    describe("toJSON", () => {
        it("serializes the converter", () => {
            expect(new Reverse().toJSON()).toEqual({
                "type": "reverse"
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes a converter", () => {
            const converter = <Reverse>Reverse.fromJSON({ "type": "reverse" });
            expect(converter).toEqual(jasmine.any(Reverse));
        });
    });
});
