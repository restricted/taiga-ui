import {NgModule} from '@angular/core';
import {isApple} from '@taiga-ui/cdk/utils';

import {TuiAutoFocusDirective} from './autofocus.directive';
import {TUI_AUTOFOCUS_HANDLER} from './autofocus.options';
import {TuiDefaultAutofocusHandler} from './handlers/default.handler';
import {TuiIosAutofocusHandler} from './handlers/ios.handler';

@NgModule({
    declarations: [TuiAutoFocusDirective],
    exports: [TuiAutoFocusDirective],
    providers: [
        {
            provide: TUI_AUTOFOCUS_HANDLER,
            useClass:
                typeof navigator !== 'undefined' && isApple(navigator)
                    ? TuiIosAutofocusHandler
                    : TuiDefaultAutofocusHandler,
        },
    ],
})
export class TuiAutoFocusModule {}
