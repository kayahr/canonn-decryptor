/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "zone.js";
import "@angular/compiler";

import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { type Routes, provideRouter, withHashLocation } from "@angular/router";

import { AppComponent } from "./AppComponent.ts";
import { DecryptorComponent } from "./decryptor/DecryptorComponent.ts";

const routes: Routes = [
    { path: "", component: DecryptorComponent }
];

// ESBuild live reload. See https://esbuild.github.io/api/#live-reload
if (process.env.ESBUILD_MODE === "serve") {
    new EventSource("/esbuild").addEventListener("change", () => {
        location.reload();
    });
} else {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withHashLocation())
    ]
}).catch(console.error);
