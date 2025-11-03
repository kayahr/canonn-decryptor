/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef, Renderer2, inject } from "@angular/core";

let inputLabelLinkCounter = 0;

/**
 * A directive for adding an empty label after a checkbox which can then be used to apply a custom checkbox style by
 * hiding the checkbox itself and styling the label as a checkbox instead. The label is automatically connected via
 * an ID (auto-generated if none exists) to the checkbox.
 *
 * Usage example:
 *
 * ```
 * <input type="checkbox" custom-checkbox />
 * ```
 */
@Directive({
    selector: "input[custom-checkbox]"
})
export class CustomCheckboxDirective {
    public constructor() {
        const renderer = inject(Renderer2);
        const elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
        const inputElement = elementRef.nativeElement;
        if (inputElement.id === "" || inputElement.id == null) {
            inputElement.id = `custom-checkbox-label-link-${inputLabelLinkCounter++}`;
        }
        const parentNode = inputElement.parentNode;
        if (parentNode != null) {
            const labelElement = renderer.createElement("label") as HTMLLabelElement;
            inputElement.before(labelElement);
            labelElement.before(inputElement);
            labelElement.htmlFor = inputElement.id;
        }
    }
}
