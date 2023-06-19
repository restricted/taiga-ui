import {InjectionToken, ValueProvider} from '@angular/core';
import {TuiContextWithImplicit} from '@taiga-ui/cdk';
import {TuiSizeL, TuiSizeS} from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';

export interface TuiInputPasswordOptions {
    readonly icons: Readonly<{
        hide: PolymorpheusContent<TuiContextWithImplicit<TuiSizeL | TuiSizeS>>;
        show: PolymorpheusContent<TuiContextWithImplicit<TuiSizeL | TuiSizeS>>;
    }>;
}

/** Default values for the input password options. */
export const TUI_INPUT_PASSWORD_DEFAULT_OPTIONS: TuiInputPasswordOptions = {
    icons: {
        hide: ({$implicit}) =>
            $implicit === `s` ? `tuiIconEyeOff` : `tuiIconEyeOffLarge`,
        show: ({$implicit}) => ($implicit === `s` ? `tuiIconEye` : `tuiIconEyeLarge`),
    },
};

/**
 * Default parameters for input password component
 */
export const TUI_INPUT_PASSWORD_OPTIONS = new InjectionToken<TuiInputPasswordOptions>(
    `[TUI_INPUT_PASSWORD_OPTIONS]`,
    {
        factory: () => TUI_INPUT_PASSWORD_DEFAULT_OPTIONS,
    },
);

export const tuiInputPasswordOptionsProvider: (
    options: Partial<TuiInputPasswordOptions>,
) => ValueProvider = (options: Partial<TuiInputPasswordOptions>) => ({
    provide: TUI_INPUT_PASSWORD_OPTIONS,
    useValue: {...TUI_INPUT_PASSWORD_DEFAULT_OPTIONS, ...options},
});
