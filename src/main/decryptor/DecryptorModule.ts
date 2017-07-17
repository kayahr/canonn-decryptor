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
import { UIModule } from "../ui/UIModule";
import { BooleanOptionComponent } from "./BooleanOptionComponent";

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
        BooleanOptionComponent,
        SelectConverterDialog
    ],
    entryComponents: [
        SelectConverterDialog
    ]
})
export class DecryptorModule {}

import "./converters/Atbash";
import "./converters/CaesarDecoder";
import "./converters/CaesarEncoder";
import "./converters/KeywordDecoder";
import "./converters/KeywordEncoder";
import "./converters/MorseDecoder";
import "./converters/MorseEncoder";
import "./converters/NumberDecoder";
import "./converters/Reverse";
import "./converters/RomanDecoder";
import "./converters/RomanEncoder";
import "./converters/Rot13";
import "./converters/VigenereDecoder";
import "./converters/VigenereEncoder";
