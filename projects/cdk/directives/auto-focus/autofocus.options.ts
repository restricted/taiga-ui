import {InjectionToken} from '@angular/core';

export interface TuiAutofocusHandler {
    setFocus(): void;
}

export const TUI_AUTOFOCUS_HANDLER = new InjectionToken<TuiAutofocusHandler | null>(
    'Autofocusing handler',
    {factory: () => null},
);
