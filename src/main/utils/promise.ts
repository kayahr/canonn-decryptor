/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de
 * See LICENSE.md for licensing information.
 */

import { Cancelable } from "./Cancelable";
import { Canceled } from "./Canceled";

/**
 * Wraps the given standard promise and a cancellation handler into a cancelable promise.
 *
 * @param promise   The standard promise to wrap.
 * @param onCancel  Called when cancellation is requested. This callback must perform the actual cancellation of the
 *                  standard promise and then (if successfully canceled) throw the passed canceled object.
 * @return The created cancelable promise.
 */
export function cancelable<T>(promise: Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

/**
 * Wraps the given async function and a cancellation handler into a cancelable promise.
 *
 * @param asyncFunc  The async function.
 * @param onCancel   Called when cancellation is requested. This callback must perform the actual cancellation of the
 *                   async function and then (if successfully canceled) throw the passed canceled object.
 * @return The created cancelable promise.
 */
export function cancelable<T>(asyncFunc: () => Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

export function cancelable<T>(promiseOrAsync: (() => Promise<T>) | Promise<T>,
                              onCancel?: (canceled: Canceled) => void): Cancelable<T> {
    const promise = promiseOrAsync instanceof Promise ? promiseOrAsync : (<() => Promise<T>>promiseOrAsync)();
    let cancel: ((reason: string) => Promise<void>) | null = null;
    let cancelable: Cancelable<T>;
    cancelable = <Cancelable<T>>new Promise((resolve, reject) => {
        cancel = (reason: string = "") => {
            try {
                if (onCancel) {
                    onCancel(new Canceled(reason));
                }
            } catch (e) {
                reject(e);
            }
            return cancelable.then(() => {}, () => {});
        };
        promise.then(resolve, reject);
    });
    if (cancel) {
        cancelable.cancel = cancel;
    }
    return cancelable;
}
