/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Directive, EventEmitter } from "@angular/core";

/**
 * Base class for dialogs.
 */
@Directive()
export abstract class Dialog<T> {
    /** True after the dialog emitted its result. */
    private closed = false;

    /**
     * This event is triggered when the dialog is closed. Event value is the dialog result.
     *
     * @event
     */
    public readonly onClosed = new EventEmitter<T | null>();

    /**
     * Closes the dialog with the given result.
     *
     * @param value - The dialog result.
     */
    public close(value: T | null = null): void {
        if (!this.closed) {
            this.closed = true;
            this.onClosed.emit(value);
            this.onClosed.complete();
        }
    }

    /**
     * Handles a keyboard event while this is the topmost dialog.
     *
     * @param event - The keyboard event to handle.
     */
    public handleKeydown(event: KeyboardEvent): void {
        if (!event.defaultPrevented && event.key === "Escape") {
            event.preventDefault();
            this.close();
        }
    }
}
