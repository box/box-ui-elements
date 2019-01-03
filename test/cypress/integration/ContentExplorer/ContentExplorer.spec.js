describe('ContentExplorer', () => {
    before(() => {
        cy.visit('/ContentExplorer');
    });

    describe('ContentSidebar', () => {
        beforeEach(() => {
            cy.contains('Sample CSV.csv').click();
        });

        afterEach(() => {
            cy.getByTitle('Close').click();
        });

        it('Navigation within a collection keeps sidebar open', () => {
            cy.queryByTestId('bcs-content').should('exist');
            cy.getByTestId('bcpr-navigate-right').click();
            cy.queryByTestId('bcs-content').should('exist');
            cy.getByTestId('bcpr-navigate-left').click();
            cy.queryByTestId('bcs-content').should('exist');
        });

        it('Navigation within a collection keeps sidebar closed', () => {
            cy.getByTestId('sidebaractivity').click();
            cy.queryByTestId('bcs-content').should('not.exist');
            cy.getByTestId('bcpr-navigate-right').click();
            cy.queryByTestId('bcs-content').should('not.exist');
            cy.getByTestId('bcpr-navigate-left').click();
            cy.queryByTestId('bcs-content').should('not.exist');
        });
    });
});
