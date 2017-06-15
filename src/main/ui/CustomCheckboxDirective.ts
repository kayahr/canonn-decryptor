/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Renderer, ElementRef, Directive } from "@angular/core";

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
    public constructor(renderer: Renderer, elementRef: ElementRef) {
        const inputElement = elementRef.nativeElement;
        if (!inputElement.id) {
            inputElement.id = "custom-checkbox-label-link-" + inputLabelLinkCounter++;
        }
        const parentNode = inputElement.parentNode;
        if (parentNode) {
            const labelElement = <HTMLLabelElement>renderer.createElement(parentNode, "label");
            parentNode.insertBefore(labelElement, inputElement);
            parentNode.insertBefore(inputElement, labelElement);
            labelElement.htmlFor = inputElement.id;
        }
    }
}
