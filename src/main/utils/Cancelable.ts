/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for a cancelable promise.
 */
export interface Cancelable<T> extends Promise<T> {
    cancel(reason?: string): Promise<void>;
}

/**
 * Check if the given object is a cancelable promise.
 *
 * @param object  The object to check.
 * @return True if object is a cancelable promise, false if not.
 */
export function isCancelable(object: any): object is Cancelable<any> {
    return typeof(object.then) === "function" && typeof(object.cancel) === "function";
}
