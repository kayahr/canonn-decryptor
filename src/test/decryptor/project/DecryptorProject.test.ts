import { computed } from "@angular/core";
import { assertEquals, assertSame } from "@kayahr/assert";
import { describe, it } from "node:test";

import "../../../main/decryptor/converters/CaesarDecoder.ts";

import { createConverter } from "../../../main/decryptor/converters/Converter.ts";
import { Reverse } from "../../../main/decryptor/converters/Reverse.ts";
import { Rot13 } from "../../../main/decryptor/converters/Rot13.ts";
import { DecryptorInput } from "../../../main/decryptor/project/DecryptorInput.ts";
import { DecryptorOutput } from "../../../main/decryptor/project/DecryptorOutput.ts";
import { DecryptorProject } from "../../../main/decryptor/project/DecryptorProject.ts";

// cspell:ignore byyru ifmmp jbeyq olleh pmmfi uryyb

describe("DecryptorProject", () => {
    it("reactively updates an output when its input changes", () => {
        const input = new DecryptorInput();
        const output = new DecryptorOutput(new Rot13());
        const value = computed(() => output.getValue());
        input.addOutput(output);

        input.setInput("hello");
        assertSame(value(), "uryyb");

        input.setInput("world");
        assertSame(value(), "jbeyq");
    });

    it("reactively updates a Caesar output while automatically detecting its rotation", () => {
        const input = new DecryptorInput();
        const converter = createConverter("caesar-decoder");
        const output = new DecryptorOutput(converter);
        const value = computed(() => output.getValue());
        input.addOutput(output);

        input.setInput("uryyb");
        assertSame(value(), "hello");
        assertSame(converter.getOption("rotation").getValue(converter), 13);

        input.setInput("jbeyq");
        assertSame(value(), "world");
    });

    it("reactively updates an output and its children when a converter option changes", () => {
        const input = new DecryptorInput();
        const converter = createConverter("caesar-decoder");
        converter.getOption("auto").setValue(converter, false);
        converter.getOption("rotation").setValue(converter, 13);
        const output = new DecryptorOutput(converter);
        const child = new DecryptorOutput(new Reverse());
        const outputValue = computed(() => output.getValue());
        const childValue = computed(() => child.getValue());
        output.addOutput(child);
        input.addOutput(output);
        input.setInput("uryyb");

        assertSame(outputValue(), "hello");
        assertSame(childValue(), "olleh");

        converter.getOption("rotation").setValue(converter, 12);
        assertSame(outputValue(), "ifmmp");
        assertSame(childValue(), "pmmfi");
    });

    it("keeps the output tree reactive when inserting and replacing outputs", () => {
        const input = new DecryptorInput();
        const original = new DecryptorOutput(new Rot13());
        input.addOutput(original);
        input.setInput("hello");

        const inserted = new DecryptorOutput(new Reverse());
        original.insertParent(inserted);
        assertEquals(input.getOutputs(), [ inserted ]);
        assertEquals(inserted.getOutputs(), [ original ]);
        assertSame(inserted.getValue(), "olleh");
        assertSame(original.getValue(), "byyru");

        const replacement = new DecryptorOutput(new Reverse());
        original.replace(replacement);
        assertEquals(inserted.getOutputs(), [ replacement ]);
        assertSame(replacement.getValue(), "hello");
    });

    it("invalidates the saved state for nested signal changes", () => {
        const project = new DecryptorProject("Signals");
        const input = new DecryptorInput();
        const converter = createConverter("caesar-decoder");
        converter.getOption("auto").setValue(converter, false);
        converter.getOption("rotation").setValue(converter, 13);
        const output = new DecryptorOutput(converter);
        const saved = computed(() => project.isSaved());
        input.addOutput(output);
        project.addInput(input);
        project.markAsSaved();
        assertSame(saved(), true);

        input.setInput("uryyb");
        assertSame(saved(), false);

        project.markAsSaved();
        assertSame(saved(), true);
        converter.getOption("rotation").setValue(converter, 12);
        assertSame(saved(), false);
    });

    it("preserves the serialized project format", () => {
        const project = new DecryptorProject("Signals");
        const input = new DecryptorInput();
        input.setInput("hello");
        input.addOutput(new DecryptorOutput(new Rot13()));
        project.addInput(input);

        assertEquals(project.toJSON(), {
            name: "Signals",
            inputs: [ {
                input: "hello",
                outputs: [ {
                    converter: { type: "rot13" }
                } ]
            } ]
        });
    });
});
