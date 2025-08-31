/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "core-js";
import "zone.js";
import "@angular/compiler";

import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, type Routes, withHashLocation } from "@angular/router";

import { AppComponent } from "./AppComponent.js";
import { DecryptorComponent } from "./decryptor/DecryptorComponent.js";

const routes: Routes = [
    { path: "", component: DecryptorComponent }
];

enableProdMode();
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withHashLocation())
    ]
}).catch(console.error);
