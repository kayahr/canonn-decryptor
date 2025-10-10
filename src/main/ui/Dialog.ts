/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { EventEmitter, HostListener } from "@angular/core";

/**
 * Base class for dialogs.
 */
export abstract class Dialog<T> {
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
        this.onClosed.emit(value);
    }

    /**
     * Closes the dialog when pressing Escape.
     */
    @HostListener("window:keydown", [ "$event" ])
    public handleEscape(event: KeyboardEvent): void {
        if (!event.defaultPrevented && event.key === "Escape") {
            this.close();
        }
    }
}
