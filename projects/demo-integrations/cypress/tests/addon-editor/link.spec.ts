import {
    DEFAULT_TIMEOUT_AFTER_PAGE_REDIRECTION,
    EDITOR_PAGE_URL,
} from '../../support/shared.entities';
import {WAIT_BEFORE_SCREENSHOT} from './utils';

describe('Editing links in Editor', () => {
    beforeEach(() => {
        cy.tuiVisit(EDITOR_PAGE_URL);
        cy.wait(DEFAULT_TIMEOUT_AFTER_PAGE_REDIRECTION);
        cy.get('#basic').findByAutomationId('tui-doc-example').as('wrapper');
        cy.get('@wrapper').scrollIntoView().should('be.visible');

        focusToStartInEditor();
    });

    it('check if at least one link exists', () => {
        getContentEditable()
            .find('a')
            .first()
            .contains('adipiscing elit')
            .should('have.attr', 'href')
            .and('include', 'http://taiga-ui.dev');

        getScreenshotArea().matchImageSnapshot('1-exist-link');
    });

    it('switch links between', () => {
        selectTag(getContentEditable().find('strong'));
        getScreenshotArea().matchImageSnapshot('6-1-select-before-insert-anchor');

        insertLink();
        getEditLinkInput().type('wysiwyg.com');
        getScreenshotArea().matchImageSnapshot('6-2-opened-link-area');

        getEditLinkInput().type('{enter}');
        getScreenshotArea().matchImageSnapshot('6-3-new-link');

        openAnchorDropdown({containHref: 'http://wysiwyg.com'});
        getScreenshotArea().matchImageSnapshot('6-4-wysiwyg-edit-link');

        openAnchorDropdown({containHref: 'http://taiga-ui.dev'});
        getScreenshotArea().matchImageSnapshot('6-5-taiga-ui-edit-link');
    });

    it('deleting a link', () => {
        openAnchorDropdown({containHref: 'http://taiga-ui.dev'});
        trashValueByEditLink();
        getScreenshotArea().matchImageSnapshot('4-remove-link');
    });

    it('dropdown should open correctly', () => {
        openAnchorDropdown({containHref: 'http://taiga-ui.dev'});
        getScreenshotArea().matchImageSnapshot('2-opened-dropdown');

        focusToStartInEditor();
        getScreenshotArea().matchImageSnapshot('3-loose-focus');
    });

    it('edit a link', () => {
        openAnchorDropdown({containHref: 'http://taiga-ui.dev'});
        getScreenshotArea().matchImageSnapshot('5-0-edit-link');

        startEditValueInEditLink();
        getScreenshotArea().matchImageSnapshot('5-1-edit-link');

        clearValueInEditLink();
        getScreenshotArea().matchImageSnapshot('5-2-edit-link');

        getEditLinkInput().type('example.com');
        getScreenshotArea().matchImageSnapshot('5-3-edit-link');

        saveValueInEditLink();
        focusToStartInEditor();
        getScreenshotArea().matchImageSnapshot('5-4-edit-link');

        openAnchorDropdown({containHref: 'http://example.com'});
        getScreenshotArea().matchImageSnapshot('5-5-edit-link');
    });

    function openAnchorDropdown({containHref}: {containHref: string}): void {
        getContentEditable().find(`a[href="${containHref}"]`).as('link');

        cy.get('@link').click();
        /**
         * Clicking anywhere on a contenteditable box
         * always places the caret at the end of the word.
         * bug: https://github.com/cypress-io/cypress/issues/5721
         */
        cy.get('@link').type('{leftArrow}');
    }

    function focusToStartInEditor(): void {
        getContentEditable().type('{moveToStart}').click();
    }

    function startEditValueInEditLink(): void {
        cy.get('button[icon=tuiIconEditLarge]').click().wait(200);
    }

    function trashValueByEditLink(): void {
        cy.get('button[icon=tuiIconTrashLarge]').click().wait(200);
    }

    function clearValueInEditLink(): void {
        cy.get('.t-cleaner').click();
    }

    function saveValueInEditLink(): void {
        cy.get('button[icon=tuiIconCheckCircleLarge]').click();
    }

    function insertLink(): void {
        cy.get('@wrapper').find('button[icon=tuiIconLinkLarge]').click();
    }

    function getEditLinkInput(): Cypress.Chainable<JQuery> {
        return cy.get('tui-edit-link').find('input');
    }

    function getScreenshotArea(): Cypress.Chainable<JQuery> {
        return cy.get('@wrapper').wait(WAIT_BEFORE_SCREENSHOT);
    }

    function getContentEditable(): Cypress.Chainable<JQuery> {
        return cy.get('@wrapper').find('[contenteditable]');
    }

    function selectTag(selector: Cypress.Chainable<JQuery>): void {
        selector
            .should('be.visible')
            .click({force: true})
            .trigger('mousedown', {force: true})
            .then($el => {
                const el = $el[0];
                const document = el.ownerDocument;
                const range = document?.createRange();

                range?.selectNodeContents(el);
                document?.getSelection()?.removeAllRanges();
                document?.getSelection()?.addRange(range!);
            })
            .trigger('mouseup', {force: true});

        cy.document().trigger('selectionchange', {force: true});
    }
});
