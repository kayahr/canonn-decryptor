/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isEquatable } from "./Equatable.js";

/**
 * Internal implementation of equals which can recursively dive deep into arrays and objects to check for equality.
 *
 * @param obj1  An object.
 * @param obj2  An object to be compared with `obj1` for equality.
 * @param seen  Array of already checked objects.
 * @return True if the arguments are equal to each other and false otherwise.
 */
function deepEquals(obj1: object | null | undefined, obj2: object | null | undefined, seen: object[] = []): boolean {
    // Check if objects are exactly the same instance or same primitive value
    if (obj1 === obj2) {
        return true;
    }

    // Check for null/undefined
    if (obj1 == null || obj2 == null) {
        return false;
    }

    // Check if objects are already checked (To prevent endless recursion loops)
    const seen1 = seen.indexOf(obj1) !== -1;
    const seen2 = seen.indexOf(obj2) !== -1;
    if (seen1 && seen2) {
        return true;
    }
    if (seen1 || seen2) {
        return false;
    }
    seen.push(obj1);
    seen.push(obj2);

    // Use equals if equatable
    if (isEquatable(obj1)) {
        return obj1.equals(obj2);
    }

    // Perform deep equality check on arrays
    if (obj1 instanceof Array) {
        if (obj2 instanceof Array) {
            if (obj1.length !== obj2.length) {
                return false;
            }
            for (let i = 0, max = obj1.length; i !== max; ++i) {
                if (!deepEquals(obj1[i] as object, obj2[i] as object, seen)) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    // Perform deep equality check on objects
    if ((obj1 instanceof Object) && (obj2 instanceof Object)) {
        // Functions are also objects but when they didn't matched at the `===` check at the beginning then we already
        // know that they can't be equal
        if ((obj1 instanceof Function) || (obj2 instanceof Function)) {
            return false;
        }

        // Build array with all keys from obj1 and obj2
        const keys = Object.keys(obj1);
        for (const key of Object.keys(obj2)) {
            if (keys.indexOf(key) < 0) {
                keys.push(key);
            }
        }

        // Check if all properties of the objects are equal
        return keys.every(key => deepEquals((obj1 as Record<string, object>)[key], (obj2 as Record<string, object>)[key], seen));
    }

    // Not equal
    return false;
}

/**
 * Returns true if the arguments are equal to each other and false otherwise. Consequently, if both arguments are null,
 * true is returned and if exactly one argument is null, false is returned. Otherwise, equality is determined by using
 * the equals method of the first argument if present or the `===` operator if the argument has no `equals` method.
 *
 * If both arguments are arrays then the array items are checked for equality recursively.
 *
 * If both arguments are objects (but not providing an equals function) then key/values are checked for equality
 * recursively.
 *
 * @param obj1  An object.
 * @param obj2  An object to be compared with `obj1` for equality.
 * @return True if the arguments are equal to each other and false otherwise.
 */
export function equals(obj1: Object | null | undefined, obj2: Object | null | undefined): boolean {
    return deepEquals(obj1, obj2);
}
