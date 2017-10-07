/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Renderer, ElementRef, Directive } from "@angular/core";

/**
 * A directive which blurs buttons on click by default.
 */
@Directive({
    selector: "button"
})
export class ButtonDirective {
    private elementRef: ElementRef;

    public constructor(renderer: Renderer, elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    public ngOnInit() {
        this.elementRef.nativeElement.addEventListener("click", () => {
            this.elementRef.nativeElement.blur();
        });
    }
}
