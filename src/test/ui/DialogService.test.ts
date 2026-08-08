import "@angular/compiler";

import type { ComponentRef, Renderer2, ViewContainerRef } from "@angular/core";
import { assertEquals, assertSame } from "@kayahr/assert";
import { registerHooks } from "node:module";
import { describe, it } from "node:test";

import { Dialog } from "../../main/ui/Dialog.ts";
import type { DialogService as DialogServiceInstance } from "../../main/ui/DialogService.ts";

const htmlHook = registerHooks({
    load: (url, context, nextLoad) => {
        if (url.endsWith(".html")) {
            return {
                format: "module",
                shortCircuit: true,
                source: "export default \"\";"
            };
        }
        return nextLoad(url, context);
    }
});
const { DialogService } = await import("../../main/ui/DialogService.ts");
htmlHook.deregister();

interface CreatedDialog {
    readonly instance: Dialog<unknown>;
    destroyCount: number;
}

interface DialogHarness {
    readonly cleanup: () => void;
    readonly createdDialogs: CreatedDialog[];
    readonly service: DialogServiceInstance;
    isListenerRemoved(): boolean;
    keydown(key: string): KeyboardEvent;
}

class RecordingDialog extends Dialog<string> {
    public readonly handledKeys: string[] = [];

    public override handleKeydown(event: KeyboardEvent): void {
        this.handledKeys.push(event.key);
        super.handleKeydown(event);
    }
}

class TestDialog extends Dialog<string> {}

function createKeyboardEvent(key: string): KeyboardEvent {
    let defaultPrevented = false;
    return {
        get defaultPrevented(): boolean {
            return defaultPrevented;
        },
        key,
        preventDefault: () => {
            defaultPrevented = true;
        }
    } as unknown as KeyboardEvent;
}

function createDialogHarness(): DialogHarness {
    const createdDialogs: CreatedDialog[] = [];
    let keydownListener: ((event: KeyboardEvent) => void) | null = null;
    let listenerRemoved = false;

    const viewContainer = {
        createComponent: (component: new () => Dialog<unknown>): ComponentRef<Dialog<unknown>> => {
            const instance = new component();
            const destroyCallbacks: Array<() => void> = [];
            const createdDialog: CreatedDialog = { instance, destroyCount: 0 };
            createdDialogs.push(createdDialog);
            return {
                destroy: () => {
                    if (createdDialog.destroyCount === 0) {
                        createdDialog.destroyCount++;
                        for (const callback of destroyCallbacks) {
                            callback();
                        }
                    }
                },
                instance,
                location: {
                    nativeElement: {
                        querySelector: () => null
                    }
                },
                onDestroy: (callback: () => void) => destroyCallbacks.push(callback)
            } as unknown as ComponentRef<Dialog<unknown>>;
        }
    } as unknown as ViewContainerRef;
    const renderer = {
        addClass: () => undefined,
        listen: (target: string, eventName: string, listener: (event: KeyboardEvent) => void) => {
            assertSame(target, "window");
            assertSame(eventName, "keydown");
            keydownListener = listener;
            return () => {
                listenerRemoved = true;
                keydownListener = null;
            };
        },
        removeClass: () => undefined,
        setStyle: () => undefined
    } as unknown as Renderer2;
    const service = new DialogService();
    const cleanup = service.registerOutlet(viewContainer, renderer);

    return {
        cleanup,
        createdDialogs,
        isListenerRemoved: () => listenerRemoved,
        keydown: key => {
            const event = createKeyboardEvent(key);
            keydownListener?.(event);
            return event;
        },
        service
    };
}

describe("DialogService", () => {
    it("routes Enter and Escape only to the topmost dialog", async () => {
        const harness = createDialogHarness();
        const firstResult = harness.service.openDialog(RecordingDialog);
        const secondResult = harness.service.openDialog(RecordingDialog);
        const firstDialog = harness.createdDialogs[0].instance as RecordingDialog;
        const secondDialog = harness.createdDialogs[1].instance as RecordingDialog;

        const enterEvent = harness.keydown("Enter");
        const escapeEvent = harness.keydown("Escape");

        assertEquals(firstDialog.handledKeys, []);
        assertEquals(secondDialog.handledKeys, [ "Enter", "Escape" ]);
        assertSame(enterEvent.defaultPrevented, false);
        assertSame(escapeEvent.defaultPrevented, true);
        assertSame(await secondResult, null);

        harness.cleanup();
        assertSame(await firstResult, null);
    });

    it("settles a dialog which closes synchronously during initialization", async () => {
        const harness = createDialogHarness();

        const result = await harness.service.openDialog(TestDialog, {
            init: dialog => dialog.close("initialized")
        });

        assertSame(result, "initialized");
        assertSame(harness.createdDialogs[0].destroyCount, 1);
        harness.cleanup();
    });

    it("settles and destroys all open dialogs when the outlet is cleaned up", async () => {
        const harness = createDialogHarness();
        const firstResult = harness.service.openDialog(TestDialog);
        const secondResult = harness.service.openDialog(TestDialog);

        harness.cleanup();

        assertSame(await firstResult, null);
        assertSame(await secondResult, null);
        assertEquals(harness.createdDialogs.map(dialog => dialog.destroyCount), [ 1, 1 ]);
        assertSame(harness.isListenerRemoved(), true);
    });
});
