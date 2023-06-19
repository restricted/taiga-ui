import {getActiveProject} from 'ng-morph';

import {DEPRECATED_BREAKPOINTS} from '../constants/breakpoints';

export const TUI_WARNING_NORMALIZE = `
// [WARNING]: In version 3.0 we drop to support normalize(v7) out-of-the-box
// You need to manually download css file from https://necolas.github.io/normalize.css/
// If you're looking to use reset styles or you can write your own reset.css`;

export const TUI_WARNING_WRAPPER_MIXINS = `// TODO: (Taiga UI migration): use mixins to customize tuiWrapper. See https://taiga-ui.dev/wrapper`;

export function replaceStyles(): void {
    getActiveProject()
        ?.getSourceFiles(`**/**.less`)
        .forEach(sourceFile => {
            let fullText = sourceFile.getFullText();

            if (fullText.includes(`taiga-ui`)) {
                DEPRECATED_BREAKPOINTS.forEach(({from, to}) => {
                    fullText = fullText.replace(
                        new RegExp(`(?<=@media.*)(${from})(?=[\\s,{])`, `g`),
                        to,
                    );
                });
            }

            fullText = fullText
                .replace(`tui-wrapper`, `${TUI_WARNING_WRAPPER_MIXINS}\n[tuiWrapper]`)
                .replace(`&[data-state='hovered']`, `&[data-state='hover']`)
                .replace(`&[data-state='pressed']`, `&[data-state='active']`)
                .replace(`tui-portal-host`, `tui-dropdown-host`)
                .replace(`tui-dropdown-box`, `tui-dropdown`)
                .replace(`--tui-color-link`, `--tui-link`)
                .replace(/@import '~@taiga-ui/g, `@import '@taiga-ui`)
                .replace(
                    `@import '@taiga-ui/core/styles/taiga-ui-global';`,
                    `${TUI_WARNING_NORMALIZE}\n@import '@taiga-ui/styles/taiga-ui-global.less';`,
                )
                .replace(/@import '@taiga-ui\/.+(.less)?';/g, val =>
                    `${val.replace(`';`, ``)}.less';`.replace(`.less.less`, `.less`),
                );

            sourceFile.replaceWithText(fullText);
        });
}
