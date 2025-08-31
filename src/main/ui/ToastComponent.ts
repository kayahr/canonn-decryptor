import { Component } from "@angular/core";

import template from "../../../assets/ui/toast.html?raw";

/**
 * The component used to display toast messages.
 */
@Component({
    selector: "div.toast",
    template
})
export class ToastComponent {
    public text = "";
}
