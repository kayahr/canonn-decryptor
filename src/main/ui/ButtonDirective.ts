/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef, inject } from "@angular/core";

/**
 * A directive which blurs buttons on click by default.
 */
@Directive({
    selector: "button",
    host: {
        "(click)": "blur()"
    }
})
export class ButtonDirective {
    private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

    public blur(): void {
        this.elementRef.nativeElement.blur();
    }
}
