/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { error } from "./error";

/**
 * Error with which canceled promises are rejected.
 */
@error("Canceled")
export class Canceled extends Error {
    /**
     * @param reason  The cancellation reason.
     */
    constructor(reason: string = "") {
        super(reason);
    }
}
