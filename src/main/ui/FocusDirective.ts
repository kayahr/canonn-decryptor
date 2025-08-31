/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef } from "@angular/core";

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
    private readonly elementRef: ElementRef<HTMLElement>;

    public constructor(elementRef: ElementRef<HTMLElement>) {
        this.elementRef = elementRef;
    }

    public ngOnInit(): void {
        this.elementRef.nativeElement.focus();
    }
}
