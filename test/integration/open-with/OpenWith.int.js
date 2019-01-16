// <reference types="Cypress" />

describe('OpenWith', () => {
    beforeEach(() => {
        cy.server();
    });

    it('integrations will render when the dropdown is clicked', () => {
        cy.route(
            'GET',
            '**/files/*/open_with_integrations',
            'fixture:open_with_integrations/multipleIntegrations.json',
        );

        cy.visit('/ContentOpenWith');

        // // Click the Open With button
        cy.getByTestId('multipleintegrationsbutton').click();
        // // The dropdown should render
        cy.getByTestId('openwithdropdown').should('exist');
    });
});
