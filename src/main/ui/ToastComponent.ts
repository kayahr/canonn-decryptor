import { Component } from "@angular/core";

/**
 * The component used to display toast messages.
 */
@Component({
    selector: "div.toast",
    templateUrl: "assets/ui/toast.html"
})
export class ToastComponent {
    public text: string;
}
