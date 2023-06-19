import {Component, Inject, TemplateRef} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {TuiDocExample} from '@taiga-ui/addon-doc';
import {
    TuiAlertService,
    TuiDialogContext,
    TuiDialogService,
    TuiDialogSize,
} from '@taiga-ui/core';
import {switchMap} from 'rxjs/operators';

@Component({
    selector: 'example-tui-dialog',
    templateUrl: './dialog.template.html',
    styleUrls: ['./dialog.style.less'],
    changeDetection,
})
export class ExampleTuiDialogComponent {
    readonly method = import('./method.md?raw');

    readonly dialogsCloseToken = import('./examples/import/dialogs-close-token.md?raw');

    readonly exampleDialogClosesOnBackToken = import(
        './examples/import/dialog-closes-on-back-token.md?raw'
    );

    readonly example1: TuiDocExample = {
        TypeScript: import('./examples/1/index.ts?raw'),
        HTML: import('./examples/1/index.html?raw'),
    };

    readonly example2: TuiDocExample = {
        TypeScript: import('./examples/2/index.ts?raw'),
        HTML: import('./examples/2/index.html?raw'),
        'dialog-example/dialog-example.module.ts': import(
            './examples/2/dialog-example/dialog-example.module.ts?raw'
        ),
        'dialog-example/dialog-example.component.ts': import(
            './examples/2/dialog-example/dialog-example.component.ts?raw'
        ),
        'dialog-example/dialog-example.style.less': import(
            './examples/2/dialog-example/dialog-example.style.less?raw'
        ),
        'dialog-example/dialog-example.template.html': import(
            './examples/2/dialog-example/dialog-example.template.html?raw'
        ),
    };

    readonly example3: TuiDocExample = {
        TypeScript: import('./examples/3/index.ts?raw'),
        HTML: import('./examples/3/index.html?raw'),
    };

    readonly example4: TuiDocExample = {
        TypeScript: import('./examples/4/index.ts?raw'),
        HTML: import('./examples/4/index.html?raw'),
        LESS: import('./examples/4/index.less?raw'),
    };

    readonly example5: TuiDocExample = {
        TypeScript: import('./examples/5/index.ts?raw'),
        HTML: import('./examples/5/index.html?raw'),
        LESS: import('./examples/5/index.less?raw'),
    };

    readonly example6: TuiDocExample = {
        TypeScript: import('./examples/6/index.ts?raw'),
        HTML: import('./examples/6/index.html?raw'),
    };

    readonly example7: TuiDocExample = {
        TypeScript: import('./examples/7/index.ts?raw'),
        HTML: import('./examples/7/index.html?raw'),
        'search-example/search-dialog-example.component.ts': import(
            './examples/7/search-example/search-dialog-example.component.ts?raw'
        ),
        'search-example/search-dialog-example.template.html': import(
            './examples/7/search-example/search-dialog-example.template.html?raw'
        ),
        'search-example/search-dialog-example.component.less': import(
            './examples/7/search-example/search-dialog-example.component.less?raw'
        ),
        'search-example/search-dialog.module.ts': import(
            './examples/7/search-example/search-dialog.module.ts?raw'
        ),
    };

    readonly example8: TuiDocExample = {
        TypeScript: import('./examples/8/index.ts?raw'),
        HTML: import('./examples/8/index.html?raw'),
    };

    readonly example9: TuiDocExample = {
        TypeScript: import('./examples/9/index.ts?raw'),
        HTML: import('./examples/9/index.html?raw'),
        LESS: import('./examples/9/index.less?raw'),
        'helpers/mock-cards.ts': import('./examples/9/helpers/mock-cards.ts?raw'),
        'helpers/models.ts': import('./examples/9/helpers/models.ts?raw'),
        'helpers/pay.service.ts': import('./examples/9/helpers/pay.service.ts?raw'),
        'helpers/validator.ts': import('./examples/9/helpers/validator.ts?raw'),
        'pay-modal/pay-modal.component.ts': import(
            './examples/9/pay-modal/pay-modal.component.ts?raw'
        ),
        'pay-modal/pay-modal.component.less': import(
            './examples/9/pay-modal/pay-modal.component.less?raw'
        ),
        'pay-modal/pay-modal.component.html': import(
            './examples/9/pay-modal/pay-modal.component.html?raw'
        ),
        'pay-modal/pay-modal.module.ts': import(
            './examples/9/pay-modal/pay-modal.module.ts?raw'
        ),
    };

    readonly exampleServiceUsage = import('./examples/import/service-usage.md?raw');

    readonly exampleCustomDialog = import('./examples/import/custom-dialog.md?raw');

    readonly exampleLazyModule = import('./examples/import/lazy-module.md?raw');

    readonly exampleModule = import('./examples/import/module.md?raw');

    data = 100;

    closeable = true;

    dismissible = true;

    required = false;

    readonly sizeVariants: readonly TuiDialogSize[] = [
        's',
        'm',
        'l',
        'fullscreen',
        'page',
        'auto',
    ];

    size: TuiDialogSize = this.sizeVariants[1];

    label = '';

    constructor(
        @Inject(TuiAlertService)
        private readonly alerts: TuiAlertService,
        @Inject(TuiDialogService)
        private readonly dialogs: TuiDialogService,
    ) {}

    showDialog(content: TemplateRef<TuiDialogContext<number, number>>): void {
        const {data, label, required, closeable, dismissible, size} = this;

        this.dialogs
            .open(content, {data, label, required, closeable, dismissible, size})
            .pipe(switchMap(response => this.alerts.open(String(response))))
            .subscribe();
    }
}
