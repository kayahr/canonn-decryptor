import "@angular/compiler";

import { ElementRef, Injector, Renderer2, runInInjectionContext } from "@angular/core";
import { assertEquals, assertSame } from "@kayahr/assert";
import { describe, it } from "node:test";

import { NoUpdateOnEditDirective } from "../../main/ui/NoUpdateOnEditDirective.ts";
import type { StringValue } from "../../main/ui/StringValue.ts";

interface TestInput {
    disabled: boolean;
    value: string;
}

function createDirective(): { directive: NoUpdateOnEditDirective, input: TestInput } {
    const input: TestInput = { disabled: false, value: "" };
    const renderer = {
        setProperty: (target: TestInput, property: keyof TestInput, value: boolean | string): void => {
            Object.assign(target, { [property]: value });
        }
    } as Renderer2;
    const injector = Injector.create({ providers: [
        { provide: ElementRef, useValue: new ElementRef(input) },
        { provide: Renderer2, useValue: renderer }
    ] });
    const directive = runInInjectionContext(injector, () => new NoUpdateOnEditDirective());
    return { directive, input };
}

describe("NoUpdateOnEditDirective", () => {
    it("keeps the edited value until the input loses focus", () => {
        const { directive, input } = createDirective();
        let touched = 0;
        directive.registerOnTouched(() => touched++);
        directive.writeValue("initial");
        directive.enter();
        directive.writeValue("normalized");

        assertSame(input.value, "initial");
        assertSame(touched, 0);

        directive.leave();
        assertSame(input.value, "normalized");
        assertSame(touched, 1);
    });

    it("reports edits only to the currently registered change callback", () => {
        const { directive } = createDirective();
        const changes: string[] = [];
        directive.registerOnChange(() => changes.push("old"));
        directive.registerOnChange((value: StringValue) => changes.push(value.valueOf()));

        directive.input("edited");

        assertEquals(changes, [ "edited" ]);
    });

    it("normalizes empty model values and applies the disabled state", () => {
        const { directive, input } = createDirective();
        directive.writeValue(null);
        directive.setDisabledState(true);

        assertSame(input.value, "");
        assertSame(input.disabled, true);
    });
});
