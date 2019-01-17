// <reference types="Cypress" />
import l from '../../support/i18n';

describe('OpenWith', () => {
    beforeEach(() => {
        cy.server();
        cy.route('GET', '**/files/*?fields=extension', 'fixture:open-with/file-extension-document');
    });

    it('A single integration', () => {
        cy.route('GET', '**/files/*/open_with_integrations', 'fixture:open-with/integration-adobe');
        cy.visit('/ContentOpenWith');

        // The button should be enabled
        cy.getByTestId('singleintegrationbutton').should('not.have.attr', 'aria-disabled', 'true');

        // Hover over the Open With button
        cy.getByTestId('bcow-content').trigger('mouseover');
        // Tooltip should render on mouseover
        cy.get('[role="tooltip"]').contains('Send this document for signature');
    });

    it('A custom integration', () => {
        cy.route('GET', '**/files/*/open_with_integrations', 'fixture:open-with/integration-custom');
        cy.visit('/ContentOpenWith');

        // The button should be enabled
        cy.getByTestId('singleintegrationbutton').should('not.have.attr', 'aria-disabled', 'true');

        // Hover over the Open With button
        cy.getByTestId('bcow-content').trigger('mouseover');
        // Tooltip should render on mouseover
        cy.get('[role="tooltip"]').contains('This is a custom integration');
    });

    it('Multiple integrations', () => {
        cy.route('GET', '**/files/*/open_with_integrations', 'fixture:open-with/integrations-multiple');
        cy.visit('/ContentOpenWith');

        // Click the Open With button
        cy.getByTestId('multipleintegrationsbutton').click();
        cy.get('[role="menuitem"]').as('menuItem');

        // The dropdown should render in sorted order
        cy.get('@menuItem')
            .eq(0)
            .contains('Open');
        cy.get('@menuItem')
            .eq(1)
            .contains('Google Docs (beta)');
        cy.get('@menuItem')
            .eq(2)
            .contains('Adobe Sign');
        cy.get('@menuItem')
            .eq(3)
            .contains('My custom integration');
    });

    describe('box edit', () => {
        it('box edit is uninstalled', () => {
            cy.route('GET', '**/files/*/open_with_integrations', 'fixture:open-with/integration-box-edit');
            cy.visit('/ContentOpenWith');

            // The button should be disabled
            cy.getByTestId('singleintegrationbutton').should('have.attr', 'aria-disabled', 'true');

            // Tooltip should render automatically
            cy.get('[role="tooltip"]')
                .as('tooltip')
                .contains(l('be.boxToolsInstallMessage', { boxTools: 'Box Tools' }));

            // Clicking on the close button of the tooltip
            cy.get('@tooltip')
                .find('button')
                .click();

            // Tooltip should be hidden
            cy.get('@tooltip').should('not.be.visible');

            // The Box Edit entry should be using the word document icon
            cy.get('.icon-file-word-document');
        });

        [
            {
                title: 'box edit is enabled',
                fixture: 'fixture:open-with/integration-box-edit',
            },
            {
                title: 'box edit sfc is enabled',
                fixture: 'fixture:open-with/integration-box-edit-sfc',
            },
            {
                title: 'box edit and box edit sfc are enabled',
                fixture: 'fixture:open-with/integration-box-edit-and-sfc',
            },
        ].forEach(test => {
            it(test.title, () => {
                cy.route('GET', '**/status', 'fixture:open-with/box-edit-status');
                cy.route(
                    'POST',
                    '**/application_request?application=BoxEdit&*',
                    'fixture:open-with/box-edit-application-request',
                );
                cy.route('GET', '**/files/*/open_with_integrations', test.fixture);
                cy.visit('/ContentOpenWith');

                // The button should be enabled
                cy.getByTestId('singleintegrationbutton').should('not.have.attr', 'aria-disabled', 'true');

                // Hover over the Open With button
                cy.getByTestId('bcow-content').trigger('mouseover');

                // Tooltip should render on mouseover
                cy.get('[role="tooltip"]').contains('Open this file on your computer');
            });
        });

        it('box edit cannot open the particular file type', () => {
            cy.route('GET', '**/status', 'fixture:open-with/box-edit-status');
            cy.route('GET', '**/files/*/open_with_integrations', 'fixture:open-with/integration-box-edit');
            cy.route(
                'POST',
                '**/application_request?application=BoxEdit&*',
                'fixture:open-with/box-edit-application-request-fail',
            ).as('getApplications');
            cy.visit('/ContentOpenWith');

            // The button should be disabled
            cy.getByTestId('singleintegrationbutton').should('have.attr', 'aria-disabled', 'true');

            // Wait until we know what openable applications are available
            cy.wait(['@getApplications']);

            // Hover over the Open With button
            cy.getByTestId('bcow-content').trigger('mouseover');

            // Tooltip should render on mouseover
            cy.get('[role="tooltip"]').contains(l('be.boxEditBlacklistedError'));
        });
    });
});
