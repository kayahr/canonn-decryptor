/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Renderer, EventEmitter, ExistingProvider, ElementRef, forwardRef, Directive } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { StringValue } from "./StringValue";

const NO_UPDATE_ON_EDIT_ACCESSOR: ExistingProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NoUpdateOnEditDirective),
    multi: true
};

/**
 * A directive for input fields which prevent updating the input value while editing. So when input field is
 * two-way-bound to a model and the model corrects the entered value then this corrected value is not written back
 * into the text field while the user is still editing it. The corrected value is written when user leaves the
 * input field or presses the enter key.
 *
 * This greatly improves the editing experience for number values for example where an empty input field value is
 * converted to a 0 by the model and you don't want that 0 immediately appear in the input field while the user
 * is still trying to enter a new number.
 *
 * Usage example:
 *
 * ```
 * <input type="number" [(ngModel)]="longitude" no-update-on-edit />
 * ```
 */
@Directive({
    selector: "input[no-update-on-edit]",
    host: {
        "(input)": "input($event.target.value)",
        "(blur)": "leave()",
        "(focus)": "enter()",
        "(keyup.enter)": "update()"
    },
    providers: [ NO_UPDATE_ON_EDIT_ACCESSOR ]
})
export class NoUpdateOnEditDirective implements ControlValueAccessor {
    private readonly onTouchedCallback = new EventEmitter<void>();
    private readonly onChangeCallback = new EventEmitter<StringValue>();
    private readonly renderer: Renderer;
    private readonly elementRef: ElementRef;
    private value = "";
    private editing = false;

    public constructor(renderer: Renderer, elementRef: ElementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }

    public input(value: string): void {
        // We emit an object containing the value so Angular thinks the value is different to the one received back
        // from the model after updating it because we need the value to come back to the [[writeValue]]() method.
        // This requires the setters and getters in the component to always cast between the input field text and
        // the actual model value type even if it is a string. This isn't ideal but so far the only solution I found.
        this.onChangeCallback.emit({ valueOf: () => value });
    }

    public enter(): void {
        this.editing = true;
    }

    public leave(): void {
        this.editing = false;
        this.update();
    }

    public update(): void {
        this.renderer.setElementProperty(this.elementRef.nativeElement, "value", this.value);
    }

    public writeValue(value: string): void {
        this.value = value;
        if (!this.editing) {
            this.renderer.setElementProperty(this.elementRef.nativeElement, "value", value);
        }
    }

    public registerOnChange(fn: any) {
        return this.onChangeCallback.subscribe(fn);
    }

    public registerOnTouched(fn: any) {
        return this.onTouchedCallback.subscribe(fn);
    }
}
