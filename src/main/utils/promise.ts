/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Cancelable } from "./Cancelable.ts";
import { Canceled } from "./Canceled.ts";
import { toError } from "./error.ts";

/**
 * Wraps the given standard promise and a cancellation handler into a cancelable promise.
 *
 * @param promise  - The standard promise to wrap.
 * @param onCancel - Called when cancellation is requested. This callback must perform the actual cancellation of the
 *                   standard promise and then (if successfully canceled) throw the passed canceled object.
 * @returns The created cancelable promise.
 */
export function cancelable<T>(promise: Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

/**
 * Wraps the given async function and a cancellation handler into a cancelable promise.
 *
 * @param asyncFunc - The async function.
 * @param onCancel  - Called when cancellation is requested. This callback must perform the actual cancellation of the
 *                    async function and then (if successfully canceled) throw the passed canceled object.
 * @returns The created cancelable promise.
 */
export function cancelable<T>(asyncFunc: () => Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

export function cancelable<T>(promiseOrAsync: (() => Promise<T>) | Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T> {
    const promise = promiseOrAsync instanceof Promise ? promiseOrAsync : (promiseOrAsync as () => Promise<T>)();
    let cancel: ((reason: string) => Promise<void>) | null = null;
    const cancelable: Cancelable<T> = new Promise((resolve, reject) => {
        cancel = (reason = "") => {
            try {
                if (onCancel != null) {
                    onCancel(new Canceled(reason));
                }
            } catch (error) {
                reject(toError(error));
            }
            return cancelable.then(() => void {}, () => {});
        };
        promise.then(resolve).catch(reject);
    }) as Cancelable<T>;
    if (cancel != null) {
        cancelable.cancel = cancel;
    }
    return cancelable;
}
