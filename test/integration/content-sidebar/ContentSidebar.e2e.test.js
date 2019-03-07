// <reference types="Cypress" />

describe('ContentSidebar', () => {
    const helpers = {
        load({ features, fileId } = {}) {
            cy.visit('/Elements/ContentSidebar', {
                onBeforeLoad: contentWindow => {
                    contentWindow.FEATURES = features;
                    contentWindow.FILE_ID = fileId;
                },
            });
        },
    };

    it('should toggle its content when a user toggles a sidebar tab', () => {
        helpers.load();

        // Sidebar should be open by default
        cy.getByTestId('bcs-content').should('exist');
        cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebarskills').click();
        cy.getByTestId('bcs-content').should('not.exist');

        cy.getByTestId('sidebarskills').click();
        cy.getByTestId('bcs-content').should('exist');
    });

    it('should switch the sidebar panel when a user navigates between tabs', () => {
        helpers.load();

        // Sidebar should be open by default
        cy.getByTestId('bcs-content').should('exist');
        cy.getByTestId('sidebarskills').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebaractivity').click();
        cy.getByTestId('sidebaractivity').should('have.class', 'bcs-nav-btn-is-selected');

        cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-nav-btn-is-selected');
    });

    it('should show and hide the version history panel when a user navigates to and from it', () => {
        helpers.load({
            features: { versions: true },
            fileId: Cypress.env('FILE_ID_DOC'),
        });

        cy.getByTestId('sidebardetails').click();
        cy.getByTestId('versionhistory').click();
        cy.contains('[data-testid="bcs-content"]', 'Version History')
            .as('versionHistory')
            .contains('Back')
            .click();
        cy.get('@versionHistory').should('not.exist');
    });
});
