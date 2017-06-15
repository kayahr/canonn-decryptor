/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Internally used container for a signal handler function bound to an object.
 *
 * @param <T>  The signal payload type.
 */
class Slot<T> {
    private func: (data: T) => void;
    private context: Object | null;

    public constructor(func: (data: T) => void, context: Object | null = null) {
        this.func = func;
        this.context = context;
    }

    public call(data: T) {
        this.func.call(this.context, data);
    }

    public equals(func: (data: T) => void, context: Object | null = null): boolean {
        return this.func === func && this.context === context;
    }
}

/**
 * Interface of the subscription object returned by [[Signal.subscribe]]().
 */
export interface Subscription {
    /**
     * Unsubscribes the subscribed observer.
     */
    unsubscribe(): void;
}

/**
 * Interface for the observer object to pass to the [[Signal.subscribe]]() method. Only the [[next]]() method is
 * supported here. Error handling is not implemented and signals are never ending so there is also no support for
 * the `complete()` method or the `closed` property.
 */
export interface Observer<T> {
    next: (data: T) => void;
}

/**
 * The observable interface implemented by the Signal class. See https://github.com/jhusain/observable-spec
 * for details.
 */
export interface Observable<T> {
    subscribe(observer: Observer<T> | ((value: T) => void)): Subscription;
}

/**
 * A signal is some kind of high-performant event emitter. You can connect listener functions or methods to it which
 * will then all be called when a new value is emitted. This class also rudimentary implements the [[Observable]]
 * interface so a signal can be used as a faster alternative to Angular's event emitters and can cooperate to some
 * degree with RxJS.
 *
 * @param <T>  The signal payload type.
 */
export class Signal<T = void> implements Observable<T> {
    /** The list of registered signal listeners (slots). Entries may be null if deleted. */
    private slots: Array<Slot<T> | null> = [];

    /**
     * Connects the given listener function or method to the signal.
     *
     * @param func      The listener function.
     * @param context   Optional context to bind the listener function to, making it a method.
     */
    public connect(func: (data: T) => void, context: Object | null = null): void {
        this.slots.push(new Slot(func, context));
    }

    /**
     * Disconnects the given listener function or method from the signal. If the listener is connected multiple
     * times then only the first listener is disconnected. If listener is not connected at all then this method
     * does nothing.
     *
     * @param func     The listener function to disconnect.
     * @param context  Optional binding context in case listener function is a method.
     */
    public disconnect(callback: (data: T) => void, context: Object | null = null): void {
        const slots = this.slots;
        for (let i = slots.length - 1; i >= 0; --i) {
            const slot = slots[i];
            if (slot && slot.equals(callback, context)) {
                slots[i] = null;
                break;
            }
        }
    }

    /**
     * Emits the signal with the given value.
     *
     * @param value  The signal payload value to emit.
     */
    public emit(value: T): void {
        const slots = this.slots;

        for (let i = 0, max = slots.length; i < max; ++i) {
            const slot = slots[i];
            if (slot) {
                slot.call(value);
            } else {
                slots.splice(i, 1);
                --i;
                --max;
            }
        }
    }

    /**
     * Subscribes the given observer to the signal. For compatibility to Angular the observer can also be
     * a function. Returns a subscription object which can be used to unsubscribe the observer from the signal.
     *
     * @param observer  The observer (or function) to subscribe.
     * @return The subscription which can be used to unsubscribe the observer from the signal.
     */
    public subscribe(observer: Observer<T> | ((value: T) => void)): Subscription {
        let func: (value: T) => void;
        let context: Object | null;
        if (observer instanceof Function) {
            func = observer;
            context = null;
        } else {
            func = observer.next;
            context = observer;
        }
        this.connect(func, context);
        return {
            unsubscribe: () => {
                this.disconnect(func, context);
            }
        };
    }
}
