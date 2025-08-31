/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef } from "@angular/core";

/**
 * A directive which blurs buttons on click by default.
 */
@Directive({
    selector: "button"
})
export class ButtonDirective {
    private readonly elementRef: ElementRef<HTMLButtonElement>;

    public constructor(elementRef: ElementRef<HTMLButtonElement>) {
        this.elementRef = elementRef;
    }

    public ngOnInit(): void {
        this.elementRef.nativeElement.addEventListener("click", () => {
            this.elementRef.nativeElement.blur();
        });
    }
}
