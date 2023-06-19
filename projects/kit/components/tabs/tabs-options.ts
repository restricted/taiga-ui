import {InjectionToken, ValueProvider} from '@angular/core';

export interface TuiTabsOptions {
    readonly underline: boolean;
    readonly exposeActive: boolean;
    readonly itemsLimit: number;
    readonly minMoreWidth: number;
}

export const TUI_TABS_DEFAULT_OPTIONS: TuiTabsOptions = {
    underline: true,
    exposeActive: true,
    itemsLimit: Infinity,
    minMoreWidth: 0,
};

/**
 * Default parameters for Tabs component
 */
export const TUI_TABS_OPTIONS = new InjectionToken<TuiTabsOptions>(`[TUI_TABS_OPTIONS]`, {
    factory: () => TUI_TABS_DEFAULT_OPTIONS,
});

export const tuiTabsOptionsProvider: (
    options: Partial<TuiTabsOptions>,
) => ValueProvider = (options: Partial<TuiTabsOptions>) => ({
    provide: TUI_TABS_OPTIONS,
    useValue: {...TUI_TABS_DEFAULT_OPTIONS, ...options},
});
