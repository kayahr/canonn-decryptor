/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef, Renderer2 } from "@angular/core";

let inputLabelLinkCounter = 0;

/**
 * A directive for automatically generating a label element with the specified label text right before the input
 * element and linking them together.
 *
 * Usage example:
 *
 * ```
 * <input type="number" [(ngModel)]="longitude" label="Longitude" />
 * ```
 */
@Directive({
    selector: "input[label], select[label]",
    inputs: [ "label" ]
})
export class LabelDirective {
    private readonly renderer: Renderer2;
    private readonly inputElement: HTMLInputElement;
    private labelElement: HTMLLabelElement | null = null;

    public constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>) {
        this.renderer = renderer;
        this.inputElement = elementRef.nativeElement;
        if (this.inputElement.id === "" || this.inputElement.id === null) {
            this.inputElement.id = "input-label-link-" + inputLabelLinkCounter++;
        }
    }

    public set label(label: string) {
        let reference: HTMLElement = this.inputElement;
        let parentElement = reference.parentElement;
        if (parentElement != null && parentElement.tagName === "LABEL") {
            reference = parentElement;
            parentElement = reference.parentElement;
        }
        if (parentElement != null) {
            if (this.labelElement == null) {
                this.labelElement = this.renderer.createElement("label") as HTMLLabelElement;
                this.labelElement.htmlFor = this.inputElement.id;
                parentElement.insertBefore(this.labelElement, reference);
            }
            this.labelElement.innerText = label;
        }
    }
}
