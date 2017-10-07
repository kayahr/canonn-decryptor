/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isEquatable } from "./Equatable";

/**
 * Checks if given array contains the given object. This also checks for equality if object implements the
 * [[Equatable]] interface.
 *
 * @param array  The array to search
 * @param object  The object to look for.
 * @return True if object was found, false if not.
 */
export function contains(array: any[], object: any): boolean {
    const checkEquality = isEquatable(object);
    for (const entry of array) {
        if (entry === object || (checkEquality && object.equals(entry))) {
            return true;
        }
    }
    return false;
}
