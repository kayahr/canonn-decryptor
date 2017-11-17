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
import { SelectOptionComponent } from "./SelectOptionComponent";
import { NumberOptionComponent } from "./NumberOptionComponent";
import { SelectConverterDialog } from "./SelectConverterDialog";
import { ProjectModule } from "../project/ProjectModule";
import { UIModule } from "../ui/UIModule";
import { BooleanOptionComponent } from "./BooleanOptionComponent";
import { KeywordCrackerDialog } from "./crackers/KeywordCrackerDialog";

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
        SelectOptionComponent,
        NumberOptionComponent,
        BooleanOptionComponent,
        SelectConverterDialog,
        KeywordCrackerDialog
    ],
    entryComponents: [
        SelectConverterDialog,
        KeywordCrackerDialog
    ]
})
export class DecryptorModule {}

import "./converters/Atbash";
import "./converters/Base64Decoder";
import "./converters/Base64Encoder";
import "./converters/CaesarDecoder";
import "./converters/CaesarEncoder";
import "./converters/KeywordDecoder";
import "./converters/KeywordEncoder";
import "./converters/MorseDecoder";
import "./converters/MorseEncoder";
import "./converters/NumberDecoder";
import "./converters/OneTimePadDecoder";
import "./converters/OneTimePadEncoder";
import "./converters/Reverse";
import "./converters/RomanDecoder";
import "./converters/RomanEncoder";
import "./converters/Rot13";
import "./converters/VigenereDecoder";
import "./converters/VigenereEncoder";
