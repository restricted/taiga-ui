import {InjectionToken, Provider} from '@angular/core';

export const TUI_DOC_EXCLUDED_PROPERTIES = new InjectionToken<Set<string>>(
    `[TUI_DOC_EXCLUDED_PROPERTIES]: Token to exclude inherited documentation properties`,
    {factory: () => new Set([])},
);

export function tuiDocExcludeProperties(properties: readonly string[]): Provider {
    return {provide: TUI_DOC_EXCLUDED_PROPERTIES, useValue: new Set(properties)};
}
