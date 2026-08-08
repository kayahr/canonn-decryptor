import "@angular/compiler";

import { assertEquals } from "@kayahr/assert";
import { describe, it } from "node:test";

import { Dialog } from "../../main/ui/Dialog.ts";

class TestDialog extends Dialog<string> {}

describe("Dialog", () => {
    it("emits exactly one result", () => {
        const dialog = new TestDialog();
        const results: Array<string | null> = [];
        dialog.onClosed.subscribe(value => results.push(value));

        dialog.close("first");
        dialog.close("second");
        dialog.close();

        assertEquals(results, [ "first" ]);
    });
});
