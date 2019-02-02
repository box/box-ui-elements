// <reference types="Cypress" />

describe('ContentExplorer', () => {
    beforeEach(() => {
        cy.visit('/Elements/ContentExplorer');
    });

    describe('ContentPreview', () => {
        beforeEach(() => {
            cy.contains('Sample Audio.mp3').click();
        });

        it('Navigation within a collection keeps sidebar open', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');

            // Navigating between files in a collection should retain the prior open state
            cy.getByTitle('Next File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
        });

        it('Navigation within a collection keeps sidebar closed', () => {
            // Manually closing the sidebar should remove its content
            cy.getByTestId('sidebarskills').click();
            cy.getByTestId('bcs-content').should('not.exist');

            // Navigating between files in a collection should retain the prior closed state
            cy.getByTitle('Next File').click();
            cy.getByTestId('bcs-content').should('not.exist');
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('not.exist');
        });

        // precedence order: skills > activity > details > metadata
        it('Navigating from file to file, tabs should switch based on order of precedence', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            // Skills tab should be selected
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

            // Navigate to previous file (Sample 3D.box3d) should default to activity feed
            cy.getByTitle('Previous File').click();
            cy.contains('Sample 3D.box3d').should('exist');
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-nav-btn-is-selected');
        });

        it('Navigating from file to file, tab should stick to prior chosen tab if it exists', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            // Skills tab should be selected
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');
            // Select the details tab
            cy.getByTestId('sidebardetails').click();

            // Navigate to previous file should keep details tab selected
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('not.have.class', 'bcs-nav-btn-is-selected');
            cy.getByTestId('sidebardetails').should('have.class', 'bcs-nav-btn-is-selected');
        });

        it('Navigating from file to file, should be able to toggle tab after tab switch based on order of preference', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            // Skills tab should be selected
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

            // Navigate to previous file should default to activity feed
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-nav-btn-is-selected');

            // Click the activity tab to toggle it closed
            cy.getByTestId('sidebaractivity').click();
            cy.getByTestId('bcs-content').should('not.exist');
        });
    });
});
