/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { type AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

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
export class FocusDirective implements AfterViewInit {
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /** @inheritdoc */
    public ngAfterViewInit(): void {
        this.elementRef.nativeElement.focus();
    }
}
