/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, ElementRef, inject } from "@angular/core";

/**
 * A directive which blurs buttons on click by default.
 */
@Directive({
    selector: "button"
})
export class ButtonDirective {
    private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

    public ngOnInit(): void {
        this.elementRef.nativeElement.addEventListener("click", () => {
            this.elementRef.nativeElement.blur();
        });
    }
}
