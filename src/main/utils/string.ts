/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Escapes a string so it can be safely used within a regular expression.
 *
 * @param s  The string to escape.
 * @return The escaped string.
 */
export function escapeRegExp(s: string): string {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
