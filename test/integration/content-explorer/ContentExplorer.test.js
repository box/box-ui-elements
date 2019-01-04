// <reference types="Cypress" />

describe('ContentExplorer', () => {
    beforeEach(() => {
        cy.visit('/ContentExplorer');
    });

    describe('ContentPreview', () => {
        beforeEach(() => {
            cy.contains('Sample Audio.mp3').click();
        });

        it('Navigation within a collection keeps sidebar open', () => {
            // Sidebar should be open by default
            cy.queryByTestId('bcs-content').should('exist');

            // Navigating between files in a collection should retain the prior open state
            cy.getByTitle('Next File').click();
            cy.queryByTestId('bcs-content').should('exist');
            cy.getByTitle('Previous File').click();
            cy.queryByTestId('bcs-content').should('exist');
        });

        it('Navigation within a collection keeps sidebar closed', () => {
            // Manually closing the sidebar should remove its content
            cy.queryByTestId('sidebaractivity').click();
            cy.queryByTestId('bcs-content').should('not.exist');

            // Navigating between files in a collection should retain the prior closed state
            cy.getByTitle('Next File').click();
            cy.queryByTestId('bcs-content').should('not.exist');
            cy.getByTitle('Previous File').click();
            cy.queryByTestId('bcs-content').should('not.exist');
        });
    });
});
