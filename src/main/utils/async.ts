/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Sleeps for the specified number of milliseconds. Can be used to easily yield control back to the browser for some
 * time so it keeps responding.
 *
 * @param ms - The number of milliseconds to sleep. Defaults to 0.
 */
export async function sleep(ms = 0): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}
