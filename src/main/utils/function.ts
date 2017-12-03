/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de
 * See LICENSE.md for licensing information.
 */

import { BoundFunction } from "./BoundFunction";
import { Cancelable } from "./Cancelable";

const queuedFunctions = new Map<Function, BoundFunction[]>();

/**
 * Get or create the list of queued functions for the specified target function.
 *
 * @param target  The target function.
 * @return The existing (or newly created) list of queued functions.
 */
function getQueuedFunctions(target: Function): BoundFunction[] {
    let queue = queuedFunctions.get(target);
    if (!queue) {
        queue = [];
        queuedFunctions.set(target, queue);
    }
    return queue;
}

/**
 * Defers a function call so the function is executed asynchronously as soon as possible.
 *
 * @param func     The function to call.
 * @param context  Optional call context to bind the function to. If not specified then the global context is used.
 * @param args     Optional arguments to pass to the deferred function.
 * @return The cancelable asynchronous response of the function call.
 */
export function defer<T>(this: any, func: (...args: any[]) => T, context: Object = this, ...args: any[]):
        Cancelable<T> {
    return new BoundFunction(func, context, ...args).defer();
}

/**
 * Defers a function call so the function is executed asynchronously as soon as possible but not sooner than the
 * specified timeout.
 *
 * @param timeout  The time in milliseconds to defer the function call for.
 * @param func     The function to call.
 * @param context  Optional call context to bind the function to. If not specified then the global context is used.
 * @param args     Optional arguments to pass to the deferred function.
 * @return The cancelable asynchronous response of the function call.
 */
export function deferFor<T>(this: any, timeout: number, func: (...args: any[]) => T, context: Object = this,
        ...args: any[]): Cancelable<T> {
    return new BoundFunction(func, context, ...args).deferFor(timeout);
}

/**
 * Defers a function call so the function is executed asynchronously as soon as possible. If the same call is already
 * queued then this function returns the asynchronous result of the already queued function call instead of deferring
 * a new call.
 *
 * @param func     The function to call.
 * @param context  Optional call context to bind the function to. If not specified then the global context is used.
 * @param args     Optional arguments to pass to the deferred function.
 * @return The cancelable asynchronous response of the function call. If call was already queued then the asynchronous
 *         response of the queued call is returned.
 */
export function queue<T>(this: any, func: (...args: any[]) => T, context: Object = this, ...args: any[]): Promise<T> {
    return queueFor(0, func, context, ...args);
}

/**
 * Defers a function call so the function is executed asynchronously as soon as possible but not sooner than the
 * specified timeout. If the same call is already queued then this function returns the asynchronous result of the
 * already queued function call instead of deferring a new call.
 *
 * @param timeout  The time in milliseconds to defer the function call for.
 * @param func     The function to call.
 * @param context  Optional call context to bind the function to. If not specified then the global context is used.
 * @param args     Optional arguments to pass to the deferred function.
 * @return The cancelable asynchronous response of the function call. If call was already queued then the asynchronous
 *         response of the queued call is returned.
 */
export function queueFor<T>(this: any, timeout: number, func: (...args: any[]) => T, context: Object = this,
        ...args: any[]): Cancelable<T> {
    const queue = getQueuedFunctions(func);

    // Check if call is already queued. If found then connect to it instead of queuing a new call.
    const bound = new BoundFunction(func, context, ...args);
    for (let queued of queue) {
        if (bound.equals(queued)) {
            return queued.queueFor(timeout);
        }
    }

    // If not already queued then queue it now and register handlers to remove it from queue when finished
    queue.push(bound);
    let queued = bound.queueFor(timeout);
    const finish = () => {
        const index = queue.indexOf(bound);
        if (index >= 0) {
            queue.splice(index, 1);
        }
    };
    queued.then(finish, finish);
    return queued;
}
