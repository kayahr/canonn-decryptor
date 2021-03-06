/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for classes which can be serialized.
 *
 * @param T  The type of the serialized JSON data.
 */
export interface Serializable<T extends Object> {
    /**
     * Serializes the object and returns the serialized JSON data.
     *
     * @return The serialized JSON data.
     */
    toJSON(): T;
}

/**
 * Interface for constructors of classes which can be deserialized.
 */
export interface SerializableStatic<T> {
    new (...args: any[]): T;

    /**
     * Deserializes the object by using the specified JSON data.
     *
     * @param json  The serialized JSON data.
     * @return The deserialized object.
     */
    fromJSON(json: Object): T;
}

/**
 * Checks if the specified object is serializable.
 *
 * @param object  The object to check.
 * @return True if object is serializable, false if not.
 */
export function isSerializable(object: any): object is Serializable<Object> {
    return typeof(object.toJSON) === "function";
}

/**
 * Checks if the specified class is deserializable.
 *
 * @param cls  The class to check.
 * @return True if class is deserializable, false if not.
 */
export function isSerializableStatic<T>(cls: new (...args: any[]) => T): cls is SerializableStatic<T> {
    return typeof((<any>cls).fromJSON) === "function";
}
