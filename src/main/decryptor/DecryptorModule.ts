/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DecryptorComponent } from "./DecryptorComponent";
import { DecryptorState } from "./DecryptorState";
import { InputComponent } from "./InputComponent";
import { OutputComponent } from "./OutputComponent";
import { StringOptionComponent } from "./StringOptionComponent";
import { NumberOptionComponent } from "./NumberOptionComponent";
import { SelectConverterDialog } from "./SelectConverterDialog";
import { ProjectModule } from "../project/ProjectModule";

import "./converters/CaesarDecoder";
import "./converters/CaesarEncoder";
import "./converters/KeywordDecoder";
import "./converters/KeywordEncoder";
import "./converters/MorseDecoder";
import "./converters/NumberDecoder";
import "./converters/RomanDecoder";
import "./converters/Rot13";
import { UIModule } from "../ui/UIModule";

const routes: Routes = [
    { path: "", component: DecryptorComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProjectModule,
        UIModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    providers: [
        DecryptorState
    ],
    declarations: [
        DecryptorComponent,
        InputComponent,
        OutputComponent,
        StringOptionComponent,
        NumberOptionComponent,
        SelectConverterDialog
    ],
    entryComponents: [
        SelectConverterDialog
    ]
})
export class DecryptorModule {}
