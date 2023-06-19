import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TuiAddonDocModule, tuiGenerateRoutes} from '@taiga-ui/addon-doc';
import {TuiHoveredModule} from '@taiga-ui/cdk';
import {TuiButtonModule} from '@taiga-ui/core';

import {TuiHoveredChangeExample1} from './examples/1';
import {ExampleTuiHoveredChangeComponent} from './hovered-change.component';

@NgModule({
    imports: [
        CommonModule,
        TuiHoveredModule,
        TuiAddonDocModule,
        TuiButtonModule,
        RouterModule.forChild(tuiGenerateRoutes(ExampleTuiHoveredChangeComponent)),
    ],
    declarations: [ExampleTuiHoveredChangeComponent, TuiHoveredChangeExample1],
    exports: [ExampleTuiHoveredChangeComponent],
})
export class ExampleTuiHoveredChangeModule {}
