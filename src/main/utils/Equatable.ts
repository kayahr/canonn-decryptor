/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for objects which can be equality-checked against other objects.
 */
export interface Equatable {
    /**
     * Checks if this object is equal to the given object. The equivalence  must follow the following contract
     * (Copied from Java's equals() method documentation):
     *
     * * It is reflexive: for any non-null reference value x, x.equals(x) should return true.
     * * It is symmetric: for any non-null reference values x and y, x.equals(y) should return true if and only if
     *   y.equals(x) returns true.
     * * It is transitive: for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z)
     *   returns true, then x.equals(z) should return true.
     * * It is consistent: for any non-null reference values x and y, multiple invocations of x.equals(y) consistently
     *   return true or consistently return false, provided no information used in equals comparisons on the objects is
     *   modified.
     * * For any non-null reference value x, x.equals(null) should return false.
     *
     * @param other  The other object to compare this one with.
     * @return True if objects are equal, false it not.
     */
    equals(other: any): boolean;
}

/**
 * Checks if given object implements the equatable interface.
 *
 * @param object  The object to check.
 * @return True if object is equatable, false if not.
 */
export function isEquatable(object: unknown): object is Equatable {
    return object instanceof Object && typeof (object as Equatable).equals === "function";
}

/**
 * Helper function which can be used to correctly implement the equality contract. The function does all the usual
 * checks and you only have to implement the actual property comparison in the the given `comparer` callback. This
 * callback is only called when the base checks passed.
 *
 * @param thisObj   The first object to compare.
 * @param otherObj  The second object to compare.
 * @param comparer  The callback which implements the actual comparison of properties. Must return true if objects
 *                  are equal or false it no.
 * @return True if objects are equal, false if not.
 */
export function isEqual<T extends Equatable>(thisObj: T, otherObj: unknown, comparer: (other: T) => boolean): boolean {
    if (otherObj === thisObj) {
        return true;
    }
    if (otherObj == null) {
        return false;
    }
    const other = otherObj as T;
    if (other.equals !== thisObj.equals) {
        return false;
    }
    return comparer.call(thisObj, other);
}
