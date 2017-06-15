/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Renderer, ElementRef, Directive } from "@angular/core";

/**
 * A directive for automatically focusing a textarea or input field on init.
 *
 * Usage example:
 *
 * ```
 * <input type="checkbox" focus />
 * ```
 */
@Directive({
    selector: "textarea[focus], input[focus]"
})
export class FocusDirective {
    private elementRef: ElementRef;

    public constructor(renderer: Renderer, elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    public ngOnInit() {
        this.elementRef.nativeElement.focus();
    }
}
