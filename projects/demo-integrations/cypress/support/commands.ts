import {tuiAddMatchImageSnapshotCommand} from '@taiga-ui/testing/cypress';

import {tuiHideHeader} from './hide-header';
import {tuiHideNavigation} from './hide-navigation';
import {tuiSetNightMode} from './set-night-mode';
import {tuiTab} from './type-tab';
import {tuiVisit} from './visit';
import {tuiWaitKitDialog} from './wait-kit-dialog';

declare global {
    namespace Cypress {
        interface Chainable {
            getByAutomationId(automationId: string): Chainable<JQuery<HTMLElement>>;
            findByAutomationId(automationId: string): Chainable<JQuery<HTMLElement>>;

            tuiVisit: typeof tuiVisit;
            tuiHideHeader: typeof tuiHideHeader;
            tuiWaitKitDialog: typeof tuiWaitKitDialog;
            tuiSetNightMode: typeof tuiSetNightMode;
            tuiHideNavigation: typeof tuiHideNavigation;

            tuiTab(direction: 'forward' | 'backward'): Chainable;
        }
    }
}

Cypress.Commands.add('getByAutomationId', id => cy.get(`[automation-id=${id}]`));
Cypress.Commands.add('findByAutomationId', {prevSubject: ['element']}, (subject, id) =>
    cy.wrap(subject).find(`[automation-id=${id}]`),
);
Cypress.Commands.add('tuiVisit', tuiVisit);
Cypress.Commands.add('tuiHideHeader', tuiHideHeader);
Cypress.Commands.add('tuiWaitKitDialog', tuiWaitKitDialog);
Cypress.Commands.add('tuiSetNightMode', tuiSetNightMode);
Cypress.Commands.add('tuiHideNavigation', tuiHideNavigation);

Cypress.Commands.add(
    'tuiTab',
    {prevSubject: ['optional', 'element', 'window', 'document']},
    tuiTab,
);

tuiAddMatchImageSnapshotCommand({
    allowSizeMismatch: true, // Windows CI fix
    runInProcess: true, // macOS CI fix
    failureThreshold: 0.0004,
    failureThresholdType: 'percent',
    comparisonMethod: 'ssim',
    diffDirection: 'vertical',
    customDiffConfig: {
        ssim: 'fast',
        windowSize: 24,
    } as any,
});
