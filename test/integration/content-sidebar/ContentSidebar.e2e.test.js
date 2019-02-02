// <reference types="Cypress" />

describe('ContentSidebar', () => {
    beforeEach(() => {
        cy.visit('/Elements/ContentSidebar');
    });

    it('Toggling the skills button should hide the sidebar', () => {
        // Sidebar should be open by default
        cy.getByTestId('bcs-content').should('exist');
        cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebarskills').click();
        cy.getByTestId('bcs-content').should('not.exist');

        cy.getByTestId('sidebarskills').click();
        cy.getByTestId('bcs-content').should('exist');
    });

    it('Clicking other tabs should switch the sidebar tab', () => {
        // Sidebar should be open by default
        cy.getByTestId('bcs-content').should('exist');
        cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebaractivity').click();
        cy.getByTestId('sidebaractivity').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-nav-btn-is-selected');
    });
});
