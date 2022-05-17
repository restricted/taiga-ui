import {AfterViewInit, Directive, Inject, Input, Optional} from '@angular/core';

import {TUI_AUTOFOCUS_HANDLER, TuiAutofocusHandler} from './autofocus.options';

@Directive({selector: '[tuiAutoFocus]'})
export class TuiAutoFocusDirective implements AfterViewInit {
    @Input()
    autoFocus = true;

    constructor(
        @Optional()
        @Inject(TUI_AUTOFOCUS_HANDLER)
        private readonly handler: TuiAutofocusHandler | null,
    ) {}

    ngAfterViewInit(): void {
        if (this.autoFocus) {
            this.handler?.setFocus();
        }
    }
}
