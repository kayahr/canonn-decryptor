/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

 /**
  * A signal emitter is simply a function which can be called to emit a signal. The signal itself can be read from
  * the signal property.
  */
export interface SignalEmitter<T> {
    (arg: T): void;
    signal: Signal<T>;
}

/**
 * Specialized signal emitter type which emits no value (void).
 */
export interface VoidSignalEmitter extends SignalEmitter<void> {
    (): void;
}

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
export class Signal<T = void, R = any> implements Observable<T> {
    /** The list of registered signal listeners (slots). Entries may be null if deleted. */
    private slots: Array<Slot<T> | null> = [];

    /** Initialization callback called when first slot is connected to signal. */
    private onInit: (emit: (arg: T) => void) => R;

    /** Optional de-initialization callback called when last slot has been disconnected from signal. */
    private onDone: ((initResult: R) => void) | null;

    /** Optional result returned from init callback and passed to done callback. */
    private initResult: R | null = null;

    /** The number of connected slots. */
    private slotCount: number = 0;

    /**
     * Creates a new signal initialized by the given init callback and de-initialized by the optionally given
     * done callback.
     *
     * @param onInit  Callback called when first slot is connected to signal. This callback is responsible to
     *                connect the signal with the actual signal emitter which must call the passed emit function
     *                to emit the signal. The callback can optionally return a value which is passed to the
     *                `onDone` callback when specified.
     * @param onDone  Optional callback called after last slot has been disconnected from the signal. The returned
     *                result of the `onInit` callback is passed as one and only parameter.
     */
    public constructor(onInit: (emit: (arg: T) => void) => R, onDone: ((initResult: R) => void) | null = null) {
        this.onInit = onInit;
        this.onDone = onDone;
    }

    /**
     * Creates a signal emitter which emits no value (void).
     *
     * @return The created signal emitter.
     */
    public static createEmitter(): VoidSignalEmitter;

    /**
     * Creates and returns a signal emitter emitting a value of the given type.
     *
     * @return The created signal emitter.
     */
    public static createEmitter<T>(): SignalEmitter<T>;

    public static createEmitter<T>(): SignalEmitter<T> {
        let emit: ((arg: T) => void) | null = null;
        const signal = new Signal((signalEmit: (arg: T) => void) => {
            emit = signalEmit;
        }, () => {
            emit = null;
        });
        return Object.assign((arg: T) => {
            if (emit) {
                emit(arg);
            }
        }, { signal });
    }

    /**
     * Connects the given listener function or method to the signal.
     *
     * @param func      The listener function.
     * @param context   Optional context to bind the listener function to, making it a method.
     */
    public connect(func: (data: T) => void, context: Object | null = null): void {
        if (this.slotCount === 0) {
            this.initResult = this.onInit((arg: T) => this.emit(arg));
        }
        this.slots.push(new Slot(func, context));
        this.slotCount++;
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
        this.slotCount--;
        if (this.slotCount === 0 && this.onDone) {
            this.onDone(<R>this.initResult);
        }
    }

    /**
     * Emits the signal with the given value.
     *
     * @param value  The signal payload value to emit.
     */
    private emit(value: T): void {
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

    /**
     * Returns a new signal connected to this one which emits the current value after the given time has passed without
     * the original signal emitting any new value.
     *
     * @param throttle  Duration of the throttle period in milliseconds.
     * @return The debounced signal.
     */
    public debounce(throttle: number): Signal<T> {
        let timer: any = null;
        return new Signal<T>(emit => {
            const subscription = this.subscribe(arg => {
                if (timer != null) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => emit(arg), throttle);
            });
            return subscription;
        }, subscription => {
            if (timer != null) {
                clearTimeout(timer);
            }
            subscription.unsubscribe();
        });
    }
}
