import {InjectionToken, ValueProvider} from '@angular/core';

import {TuiPushOptions} from './push.options';

export const TUI_PUSH_DEFAULT_OPTIONS: TuiPushOptions = {
    heading: ``,
    type: ``,
    timestamp: 0,
    image: ``,
    icon: ``,
    iconColor: ``,
    buttons: [],
};

/**
 * Default parameters for Push component
 */
export const TUI_PUSH_OPTIONS = new InjectionToken<TuiPushOptions>(`[TUI_PUSH_OPTIONS]`, {
    factory: () => TUI_PUSH_DEFAULT_OPTIONS,
});

export function tuiPushOptionsProvider(options: Partial<TuiPushOptions>): ValueProvider {
    return {
        provide: TUI_PUSH_OPTIONS,
        useValue: {...TUI_PUSH_DEFAULT_OPTIONS, ...options},
    };
}
