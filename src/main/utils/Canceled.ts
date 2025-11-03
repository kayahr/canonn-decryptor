/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Error with which canceled promises are rejected.
 */
export class Canceled extends Error {
    /**
     * @param reason - Optional cancellation reason.
     */
    public constructor(reason = "") {
        super(reason);
    }
}
