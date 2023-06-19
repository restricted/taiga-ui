import {Component, forwardRef} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {changeDetection} from '@demo/emulate/change-detection';
import {TuiDocExample, tuiDocExcludeProperties} from '@taiga-ui/addon-doc';
import {
    ALWAYS_FALSE_HANDLER,
    ALWAYS_TRUE_HANDLER,
    TuiBooleanHandler,
} from '@taiga-ui/cdk';
import {TuiHorizontalDirection, TuiSizeL, TuiSizeS} from '@taiga-ui/core';
import {TuiStringifiableItem} from '@taiga-ui/kit';

import {AbstractExampleTuiControl} from '../abstract/control';
import {ABSTRACT_PROPS_ACCESSOR} from '../abstract/inherited-documentation/abstract-props-accessor';

@Component({
    selector: 'example-input-tag',
    templateUrl: './input-tag.template.html',
    changeDetection,
    providers: [
        {
            provide: ABSTRACT_PROPS_ACCESSOR,
            useExisting: forwardRef(() => ExampleTuiInputTagComponent),
        },
        tuiDocExcludeProperties([
            'tuiTextfieldPrefix',
            'tuiTextfieldPostfix',
            'tuiTextfieldFiller',
        ]),
    ],
})
export class ExampleTuiInputTagComponent extends AbstractExampleTuiControl {
    readonly exampleModule = import('./examples/import/import-module.md?raw');
    readonly exampleHtml = import('./examples/import/insert-template.md?raw');

    readonly example1: TuiDocExample = {
        TypeScript: import('./examples/1/index.ts?raw'),
        HTML: import('./examples/1/index.html?raw'),
    };

    readonly example2: TuiDocExample = {
        TypeScript: import('./examples/2/index.ts?raw'),
        HTML: import('./examples/2/index.html?raw'),
    };

    readonly example3: TuiDocExample = {
        TypeScript: import('./examples/3/index.ts?raw'),
        HTML: import('./examples/3/index.html?raw'),
    };

    readonly example4: TuiDocExample = {
        TypeScript: import('./examples/4/index.ts?raw'),
        HTML: import('./examples/4/index.html?raw'),
    };

    readonly example5: TuiDocExample = {
        TypeScript: import('./examples/5/index.ts?raw'),
        HTML: import('./examples/5/index.html?raw'),
        LESS: import('./examples/5/index.less?raw'),
    };

    readonly example6: TuiDocExample = {
        TypeScript: import('./examples/6/index.ts?raw'),
        HTML: import('./examples/6/index.html?raw'),
        LESS: import('./examples/6/index.less?raw'),
    };

    readonly example7: TuiDocExample = {
        TypeScript: import('./examples/7/index.ts?raw'),
        HTML: import('./examples/7/index.html?raw'),
    };

    readonly example8: TuiDocExample = {
        TypeScript: import('./examples/8/index.ts?raw'),
        HTML: import('./examples/8/index.html?raw'),
        LESS: import('./examples/8/index.less?raw'),
    };

    readonly control = new FormControl(
        ['John Cleese', 'Eric Idle', 'Michael Palin'],
        Validators.required,
    );

    editable = true;

    expandable = true;

    uniqueTags = true;

    readonly separatorVariants = [',', ';', /[\d]/, /[\s,]/];

    separator = this.separatorVariants[0];

    readonly iconVariants: readonly string[] = ['tuiIconSearchLarge'];

    icon = '';

    readonly iconAlignVariants: readonly TuiHorizontalDirection[] = ['left', 'right'];

    iconAlign: TuiHorizontalDirection = this.iconAlignVariants[1];

    override maxLengthVariants: number[] = [10, 20];

    override maxLength: number | null = null;

    search = '';

    rows = 100;

    override readonly sizeVariants: ReadonlyArray<TuiSizeL | TuiSizeS> = ['s', 'm', 'l'];

    override size: TuiSizeL | TuiSizeS = this.sizeVariants[this.sizeVariants.length - 1];

    tagValidatorVariants: ReadonlyArray<TuiBooleanHandler<string>> = [
        ALWAYS_TRUE_HANDLER,
        item => item === 'test',
        item => item !== 'mail',
    ];

    tagValidator = this.tagValidatorVariants[0];

    inputHidden = false;

    readonly disabledItemHandlerVariants: Array<
        TuiBooleanHandler<TuiStringifiableItem<string> | string>
    > = [ALWAYS_FALSE_HANDLER, item => String(item).startsWith('T')];

    disabledItemHandler = this.disabledItemHandlerVariants[0];
}
