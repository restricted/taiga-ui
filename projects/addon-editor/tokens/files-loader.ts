import {InjectionToken} from '@angular/core';
import {
    TuiEditorAttachedFile,
    TuiEditorAttachOptions,
} from '@taiga-ui/addon-editor/interfaces';
import {TuiHandler} from '@taiga-ui/cdk';
import {Observable} from 'rxjs';

/**
 * files loader options
 */
export const TUI_ATTACH_FILES_OPTIONS: InjectionToken<TuiEditorAttachOptions> =
    new InjectionToken<TuiEditorAttachOptions>(`[TUI_ATTACH_FILES_OPTIONS]`, {
        factory: () => ({accept: `*/*`, multiple: true}),
    });

/**
 * files loader handler
 */
export const TUI_ATTACH_FILES_LOADER: InjectionToken<
    TuiHandler<File[], Observable<TuiEditorAttachedFile[]>>
> = new InjectionToken<TuiHandler<File[], Observable<TuiEditorAttachedFile[]>>>(
    `[TUI_ATTACH_FILES_LOADER]`,
);
