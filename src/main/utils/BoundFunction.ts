/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual } from "./Equatable";
import { equals } from "./object";
import { Cancelable } from "./Cancelable";
import { cancelable } from "./promise";

/**
 * Container for a function bound to a specific call context and arguments.
 */
export class BoundFunction<T = any> implements Equatable {
    /** The bound function. */
    private readonly func: (...args: any[]) => T;

    /** The bound call context or null if none. */
    private readonly context: Object | null;

    /** The bound call arguments. Empty if none. */
    private readonly args: any[];

    /** The promise of an already queued call. Null if not queued yet or already resolved/rejected. */
    private queued: Cancelable<T> | null;

    /**
     * Creates a new bound function bound to the specified call context and arguments.
     *
     * @param func     The function to bind.
     * @param context  Optional call context to bind to.
     * @param args     Optional arguments to pass to the bound function.
     */
    public constructor(func: (...args: any[]) => T, context: Object | null = null, ...args: any[]) {
        this.func = func;
        this.context = context;
        this.args = args;
        this.queued = null;
    }

    /** @inheritDoc */
    public equals(object: Object): boolean {
        return isEqual(this, object, (other) => this.func === other.func && this.context === other.context &&
            equals(this.args, other.args));
    }

    /**
     * Returns the bound function.
     *
     * @return The bound function.
     */
    public getFunction(): (...args: any[]) => T {
        return this.func;
    }

    /**
     * Returns the call context.
     *
     * @return The call context or null if none.
     */
    public getContext(): Object | null {
        return this.context;
    }

    /**
     * Returns a copy of the arguments passed to the bound function.
     *
     * @return A copy of the arguments passed to the bound function.
     */
    public getArguments(): any[] {
        return this.args.slice();
    }

    /**
     * Calls the bound function with the given arguments.
     *
     * @param args  The arguments to pass to the bound function.
     * @return The return value of the called bound function.
     */
    public call(...args: any[]): T {
        return this.func.call(this.context, ...this.args, ...args);
    }

    /**
     * Calls the bound function asynchronously with the given arguments.
     *
     * @param args  The additional arguments to pass to the bound function.
     * @return The cancelable asynchronous response of the function call.
     */
    public defer(...args: any[]): Cancelable<T> {
        return this.deferFor(0, ...args);
    }

    /**
     * Calls the bound function asynchronously in `timeout` milliseconds with the given arguments.
     *
     * @param timeout  The time to wait before calling the function.
     * @param args     The additional arguments to pass to the bound function.
     * @return The cancelable asynchronous response of the function call.
     */
    public deferFor(timeout: number, ...args: any[]): Cancelable<T> {
        var handle: any;
        return cancelable(new Promise<any>((resolve, reject) => {
            handle = setTimeout(() => {
                try {
                    resolve(this.func.call(this.context, ...this.args, ...args));
                } catch (e) {
                    reject(e);
                }
            }, timeout);
        }), (canceled) => {
            clearTimeout(handle);
            throw canceled;
        });
    }

    /**
     * Calls the bound function asynchronously with the given arguments if not already queued.
     *
     * @param args  The additional arguments to pass to the bound function.
     * @return The cancelable asynchronous response of the function call. If call was already queued then the
     *         asynchronous response of the queued call is returned.
     */
    public queue(...args: any[]): Cancelable<T> {
        return this.queueFor(0, ...args);
    }

    /**
     * Calls the bound function asynchronously in `timeout` milliseconds with the given arguments if not already
     * queued.
     *
     * @param timeout  The time to wait before calling the function.
     * @param args     The additional arguments to pass to the bound function.
     * @return The cancelable asynchronous response of the function call. If call was already queued then the
     *         asynchronous response of the queued call is returned.
     */
    public queueFor(timeout: number, ...args: any[]): Cancelable<T> {
        if (this.queued == null) {
            this.queued = this.deferFor(timeout, ...args);
            this.queued.then(
                (value) => { this.queued = null; return value; },
                (error) => { this.queued = null; throw error; }
            );
        }
        return this.queued;
    }
}
