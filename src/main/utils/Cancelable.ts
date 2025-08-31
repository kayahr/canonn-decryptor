/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for a cancelable promise.
 */
export interface Cancelable<T = any> extends Promise<T> {
    cancel(reason?: string): Promise<void>;
}

/**
 * Check if the given object is a cancelable promise.
 *
 * @param object  The object to check.
 * @return True if object is a cancelable promise, false if not.
 */
export function isCancelable(object: unknown): object is Cancelable {
    return object instanceof Object && typeof (object as Cancelable).then === "function" && typeof (object as Cancelable).cancel === "function";
}
