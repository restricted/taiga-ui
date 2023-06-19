import {inject, InjectionToken} from '@angular/core';
import {TuiStringHandler} from '@taiga-ui/cdk';
import {tuiIconsPathFactory} from '@taiga-ui/core/utils';

import {TUI_ICONS_PLACE} from './icon-place';

/**
 * A handler to retrieve USE id for icon by name
 * @deprecated Use {@link TUI_SVG_OPTIONS} instead
 */
export const TUI_ICONS_PATH: InjectionToken<TuiStringHandler<string>> =
    new InjectionToken<TuiStringHandler<string>>(`[TUI_ICONS_PATH]`, {
        factory: () => tuiIconsPathFactory(inject(TUI_ICONS_PLACE)),
    });
