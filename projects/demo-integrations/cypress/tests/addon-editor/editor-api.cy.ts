import {
    tuiClearEditor,
    tuiClearHint,
    tuiFocusToStartInEditor,
    tuiGetContentEditable,
    tuiGetDemoContent,
    tuiGetEditLinkInput,
    tuiGetEditorScrollbarArea,
    tuiGetNgModelValue,
    tuiGetScreenshotArea,
    tuiGetTipTapContentSelector,
    tuiInsertLink,
    tuiOpenAnchorDropdown,
    tuiOpenFontTool,
    tuiSelectTag,
    tuiVisitEditorApiPage,
} from '@demo-integrations/support/editor/helpers';
import {
    HTML_EDITOR_EXAMPLE_BLOCKQUOTE,
    HTML_EDITOR_EXAMPLE_DETAILS,
    HTML_EDITOR_EXAMPLE_HIGHLIGHT_BLOCK,
    HTML_EDITOR_EXAMPLE_LEGACY_DETAILS,
    HTML_EDITOR_EXAMPLE_LONG_WORD_UL,
    HTML_EDITOR_EXAMPLE_NESTED_OL_UL,
    HTML_EDITOR_EXAMPLE_NESTED_UL,
    HTML_EDITOR_EXAMPLE_PRE_CODE,
    HTML_EDITOR_EXAMPLE_TABLE,
    HTML_EDITOR_EXAMPLE_UL,
    HTML_EDITOR_EXAMPLE_WITH_DETAILS_INSIDE_LIST,
} from '@demo-integrations/support/editor/html';

describe(`Editor API`, () => {
    describe(`Check fonts in light and dark mode`, () => {
        for (const [index, {enableNightMode}] of [
            {enableNightMode: true},
            {enableNightMode: false},
        ].entries()) {
            it(`check font in editor, enableNightMode is ${enableNightMode}`, () => {
                tuiVisitEditorApiPage({enableNightMode});
                tuiClearEditor();

                for (const [position, type] of [
                    `Small`,
                    `Normal`,
                    `Large`,
                    `Subtitle`,
                    `Title`,
                ].entries()) {
                    const screenshot = `${
                        index + 1
                    }-1-night-mode-enabled-${enableNightMode}-font-${position}-${type}`;

                    tuiOpenFontTool()
                        .findByAutomationId(`tui_font__${type.toLowerCase()}`)
                        .tuiWaitBeforeScreenshot()
                        .click({force: true});

                    tuiGetContentEditable()
                        .type(`${type}{enter}`)
                        .tuiWaitBeforeScreenshot();

                    tuiGetScreenshotArea().matchImageSnapshot(screenshot);
                }
            });
        }
    });

    describe(`Dark mode`, () => {
        beforeEach(() => tuiVisitEditorApiPage({enableNightMode: true}));

        it(`supports dark mode (input)`, () => {
            tuiGetDemoContent().find(`tui-editor`).as(`editor`);

            cy.get(`@editor`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`1-1-dark-mode-input`);

            cy.get(`@editor`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`1-2-dark-mode-input`);
        });

        it(`supports dark mode (output)`, () => {
            tuiGetDemoContent()
                .find(`tui-editor-socket.tui-example`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`2-1-dark-mode-output`);
        });
    });

    describe(`details`, () => {
        it(`prevents extra margin between top border of details and content`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_DETAILS});

            tuiGetDemoContent()
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`prevents-extra-margin-details`);
        });

        it(`legacy`, () => {
            tuiVisitEditorApiPage({content: ``});

            cy.get(`.t-table tr`)
                .eq(2)
                .findByAutomationId(`tui-primitive-textfield__native-input`)
                .type(HTML_EDITOR_EXAMPLE_LEGACY_DETAILS, {force: true, delay: 0});

            tuiGetDemoContent().tuiWaitBeforeScreenshot().matchImageSnapshot(`legacy`);
        });
    });

    describe(`highlight`, () => {
        it(`code + pre/code`, () => {
            tuiVisitEditorApiPage({content: ``});

            cy.get(`.t-table tr`)
                .eq(2)
                .findByAutomationId(`tui-primitive-textfield__native-input`)
                .type(HTML_EDITOR_EXAMPLE_HIGHLIGHT_BLOCK, {
                    delay: 0,
                    force: true,
                    parseSpecialCharSequences: false,
                });

            tuiGetDemoContent()
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`code-block-highlight`);
        });
    });

    describe(`ordered list / bullet list`, () => {
        it(`flat`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket.tui-example`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`4-1-bullet-and-ordered-list`);
        });

        it(`nested ul`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_NESTED_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket.tui-example`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`5-1-bullet-and-ordered-nested-list`);
        });

        it(`long words`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_LONG_WORD_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket.tui-example`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`5-1-bullet-and-ordered-list-with-long-word`);
        });

        it(`nested ol and ul`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_NESTED_OL_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket.tui-example`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`5-2-bullet-and-ordered-nested-list`);
        });

        it(`emulate user toggling`, () => {
            tuiVisitEditorApiPage({content: ``});
            tuiGetDemoContent().as(`wrapper`);

            cy.get(`@wrapper`).find(tuiGetTipTapContentSelector()).as(`editor`);

            toggleBullet(`tuiIconListLarge`);

            cy.get(`@editor`).type(`1{enter}`).type(`{enter}`);

            toggleBullet(`tuiIconOLLarge`);

            cy.get(`@editor`).type(`A`);
            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`6-1-bullet-and-ordered-list`);

            clearEditor();
            toggleBullet(`tuiIconListLarge`);

            cy.get(`@editor`).type(
                `first line{shift+enter}second line{shift+enter}third line{shift+enter}{enter}first line`,
            );
            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`6-2-bullet-and-ordered-list`);

            clearEditor();
            toggleBullet(`tuiIconOLLarge`);

            cy.get(`@editor`).type(
                `first line{shift+enter}second line{shift+enter}third line{shift+enter}{enter}first line`,
            );
            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`6-3-bullet-and-ordered-list`);
        });

        it(`nested`, () => {
            tuiVisitEditorApiPage({content: ``});
            tuiGetDemoContent().as(`wrapper`);

            cy.get(`@wrapper`).find(tuiGetTipTapContentSelector()).as(`editor`);

            toggleBullet(`tuiIconListLarge`);
            cy.get(`@editor`).type(`1{enter}`);
            cy.get(`@editor`).type(`2`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`7-1-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            cy.get(`@editor`).type(`3`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`7-2-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            cy.get(`@editor`).type(`4`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`7-3-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            toggleBullet(`tuiIconOutdentLarge`);

            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`7-4-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            toggleBullet(`tuiIconOutdentLarge`);
            cy.get(`@editor`).type(`5`);

            cy.get(`@wrapper`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`7-6-nested-list`);
        });

        function toggleBullet(iconType: string): void {
            cy.get(`@wrapper`)
                .find(`button[icon="tuiIconListLarge"]`)
                .click({force: true});
            cy.get(`tui-dropdown`)
                .find(`button[icon="${iconType}"]`)
                .click({force: true});
        }

        function clearEditor(): void {
            cy.get(`@editor`).type(`{selectall}{backspace}`);
        }
    });

    describe(`Editor and Dropdown`, () => {
        beforeEach(() => tuiVisitEditorApiPage({maxHeight: 400}));

        it(`should not overlap tools`, () => {
            tuiFocusToStartInEditor();
            tuiSelectTag(tuiGetContentEditable().find(`strong`));
            tuiInsertLink();
            tuiGetEditLinkInput().type(`wysiwyg.com`);
            tuiGetEditLinkInput().type(`{enter}`);

            tuiClearHint();

            tuiOpenAnchorDropdown({containHref: `https://wysiwyg.com`});
            tuiGetEditorScrollbarArea().scrollTo(0, 100);
            tuiGetScreenshotArea().matchImageSnapshot(`8-1-added-new-link`);

            tuiGetEditorScrollbarArea().scrollTo(0, 0);
            tuiGetScreenshotArea().matchImageSnapshot(`8-2-added-new-link`);
        });
    });

    describe(`Check editor styles without important`, () => {
        for (const {name, content} of [
            {
                name: `blockquote`,
                content: HTML_EDITOR_EXAMPLE_BLOCKQUOTE,
            },
            {
                name: `code`,
                content: HTML_EDITOR_EXAMPLE_PRE_CODE,
            },
            {
                name: `table`,
                content: HTML_EDITOR_EXAMPLE_TABLE,
            },
        ]) {
            it(name, () => {
                tuiVisitEditorApiPage({content, skipDecodingUrl: true});

                cy.get(`[contenteditable]`).focus();

                tuiGetDemoContent()
                    .find(`tui-editor-socket.tui-example`)
                    .tuiWaitBeforeScreenshot()
                    .matchImageSnapshot(`tui-editor-socket.tui-example-${name}`);
            });
        }
    });

    describe(`Heading styles`, () => {
        for (const heading of [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`]) {
            it(heading, () => {
                tuiVisitEditorApiPage();
                tuiClearEditor();

                tuiGetNgModelValue()
                    .invoke(
                        `val`,
                        `<${heading}><span style="background-color: #1771e6; color: #fff">ываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываывамсываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываываывамс</span></${heading}><${heading}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</${heading}>`,
                    )
                    .trigger(`input`);

                tuiGetDemoContent()
                    .find(`tui-editor-socket.tui-example`)
                    .tuiWaitBeforeScreenshot()
                    .matchImageSnapshot(`tui-editor-socket.tui-example-${heading}`);
            });
        }
    });

    describe(`Details inside list`, () => {
        it(`support break line`, () => {
            tuiVisitEditorApiPage({
                content: HTML_EDITOR_EXAMPLE_WITH_DETAILS_INSIDE_LIST,
            });

            tuiGetDemoContent()
                .find(`[tuiTiptapEditor]`)
                .tuiWaitBeforeScreenshot()
                .matchImageSnapshot(`details-inside-list-in-editor`);
        });
    });
});
