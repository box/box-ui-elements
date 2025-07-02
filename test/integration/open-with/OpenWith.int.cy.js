// <reference types="Cypress" />
import localize from '../../support/i18n';

const getSingleButton = () => cy.getByTestId('singleintegrationbutton');
const getOpenWithContent = () => cy.getByTestId('bcow-content');
// TODO refactor OpenWith tests to use the new Cypress testing library
// Disabling test for now since its already EOL since 2021
xdescribe('OpenWith', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/files/*?fields=extension', { fixture: 'open-with/file-extension-document' });
    });

    it('A single integration', () => {
        cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integration-google-docs' });
        cy.visit('/Elements/ContentOpenWith');

        // The button should be enabled
        getSingleButton().should('not.have.attr', 'aria-disabled', 'true');

        // Hover over the Open With button
        getOpenWithContent().trigger('mouseover');
        // Tooltip should render on mouseover
        cy.getTooltip().contains('Open this file in your browser');
    });

    it('A custom integration', () => {
        cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integration-custom' });
        cy.visit('/Elements/ContentOpenWith');

        // The button should be enabled
        getSingleButton().should('not.have.attr', 'aria-disabled', 'true');

        // Hover over the Open With button
        getOpenWithContent().trigger('mouseover');
        // Tooltip should render on mouseover
        cy.getTooltip().contains('This is a custom integration');
    });

    it('Multiple integrations', () => {
        cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integrations-multiple' });
        cy.visit('/Elements/ContentOpenWith');

        // Click the Open With button
        cy.getByTestId('multipleintegrationsbutton').click();
        cy.get('[role="menuitem"]').as('menuItem');

        // The dropdown should render in sorted order
        cy.get('@menuItem').eq(0).contains('Open');
        cy.get('@menuItem').eq(1).contains('Google Docs (beta)');
        cy.get('@menuItem').eq(2).contains('My custom integration');
    });

    describe('box edit', () => {
        it('is uninstalled', () => {
            cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integration-box-edit' });
            cy.visit('/Elements/ContentOpenWith');

            // The button should be disabled
            getSingleButton().should('have.attr', 'aria-disabled', 'true');

            // Tooltip should render automatically
            cy.getTooltip()
                .as('tooltip')
                .contains(localize('be.boxToolsInstallMessage', { boxTools: 'Box Tools' }));

            // Clicking on the close button of the tooltip
            cy.get('@tooltip').find('button').click();

            // Tooltip should be hidden
            cy.get('@tooltip').should('not.be.visible');
        });

        [
            {
                title: 'is enabled',
                fixture: { fixture: 'open-with/integration-box-edit' },
            },
            {
                title: 'sfc is enabled',
                fixture: { fixture: 'open-with/integration-box-edit-sfc' },
            },
            {
                title: 'sfc and the regular integration are enabled',
                fixture: { fixture: 'open-with/integration-box-edit-and-sfc' },
            },
        ].forEach(test => {
            it(test.title, () => {
                cy.intercept('GET', '**/status', { fixture: 'open-with/box-edit-status' });
                cy.intercept('POST', '**/application_request?application=BoxEdit&*', {
                    fixture: 'open-with/box-edit-application-request',
                });
                cy.intercept('GET', '**/files/*/open_with_integrations', test.fixture);
                cy.visit('/Elements/ContentOpenWith');

                // The button should be enabled
                getSingleButton().should('not.have.attr', 'aria-disabled', 'true');

                // Hover over the Open With button
                getOpenWithContent().trigger('mouseover');

                // Tooltip should render on mouseover
                cy.getTooltip().contains('Open this file on your computer');
            });
        });

        it('box edit cannot open the particular file type', () => {
            cy.intercept('GET', '**/status', { fixture: 'open-with/box-edit-status' });
            cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integration-box-edit' });
            cy.intercept('POST', '**/application_request?application=BoxEdit&*', {
                fixture: 'open-with/box-edit-application-request-fail',
            }).as('getApplications');
            cy.visit('/Elements/ContentOpenWith');

            // The button should be disabled
            getSingleButton().should('have.attr', 'aria-disabled', 'true');

            // Wait until we know what openable applications are available
            cy.wait(['@getApplications']);

            // Hover over the Open With button
            getOpenWithContent().trigger('mouseover');

            // Tooltip should render on mouseover
            cy.getTooltip().contains(localize('be.boxEditBlacklistedError'));
        });

        it('the box edit integration cannot be executed', () => {
            cy.intercept('GET', '**/status', { fixture: 'open-with/box-edit-status' });
            cy.intercept('GET', '**/files/*/open_with_integrations', { fixture: 'open-with/integration-box-edit' });
            cy.intercept({
                method: 'POST',
                url: '**/app_integrations/**/execute',
                status: 503,
                response: {},
            }).as('executionFailure');
            cy.intercept('POST', '**/application_request?application=BoxEdit&*', {
                fixture: 'open-with/box-edit-application-request',
            }).as('boxEditAvailable');

            cy.visit('/Elements/ContentOpenWith');

            // Wait until we know what integrations are available
            cy.wait(['@boxEditAvailable']);

            // Click the Open With button
            getSingleButton().click();

            // Wait until the execution of the integration has failed
            cy.wait(['@executionFailure']);

            // Hover over the Open With button
            getOpenWithContent().trigger('mouseover');

            // The button should still display the normal tooltip
            cy.getTooltip().contains('Open this file on your computer');
        });
    });
});
