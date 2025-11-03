/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Component } from "@angular/core";

import template from "../../../assets/ui/toast.html";

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
