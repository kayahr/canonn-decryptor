/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./AppModule";
import { enableProdMode } from "@angular/core";

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
