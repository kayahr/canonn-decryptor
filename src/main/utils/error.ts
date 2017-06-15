/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Decorator which can be used to on error classes to automatically repair the broken prototype chain. Since newer
 * TypeScript versions extending standard JavaScript types like Error yields in objects with a broken prototype chain
 * which doesn't allow instanceof checks. This decorator fixes it and as an additional side effect it gives the
 * error class a name which survives source code obfuscation.
 *
 * @param className  The name of the error class used in stack traces instead of the potentially obfuscated real
 *                   class name.
 */
export function error(className: string): ClassDecorator {
    return function<E extends Error, T extends (new (...args: any[]) => E)>(constructor: T): T {
        const error: T = <any>function(this: E, ...args: any[]): E {
            const instance = constructor.apply(this, args);
            Object.setPrototypeOf(instance, error.prototype);
            instance.name = className;
            return instance;
        };
        error.prototype = constructor.prototype;
        return error;
    };
}

/**
 * Base exception class implementing the standard error constructor with an optional exception message and an
 * optional cause.
 */
export abstract class Exception extends Error {
    /** The exception cause (if any). */
    public cause: any;

    /**
     * @param message  Optional exception message.
     * @param cause    Optional original error which caused this exception.
     */
    public constructor(message?: string, cause: any = null) {
        super(message);
        this.cause = cause;
    }
}

/**
 * Thrown when an illegal argument has been specified.
 */
@error("IllegalArgumentError")
export class IllegalArgumentError extends Exception {}

/**
 * Thrown when an operation is not allowed because of an illegal state.
 */
@error("IllegalStateError")
export class IllegalStateError extends Exception {}
