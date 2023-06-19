import {InjectionToken, Provider, Type} from '@angular/core';
import {TuiDataListHost} from '@taiga-ui/core/interfaces';

/**
 * DataList controller
 */
export const TUI_DATA_LIST_HOST = new InjectionToken<TuiDataListHost<unknown>>(
    `[TUI_DATA_LIST_HOST]`,
);

export function tuiAsDataListHost(useExisting: Type<TuiDataListHost<unknown>>): Provider {
    return {
        provide: TUI_DATA_LIST_HOST,
        useExisting,
    };
}
