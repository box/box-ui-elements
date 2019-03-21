// <reference types="Cypress" />

const helpers = {
    load(additionalProps = {}) {
        cy.visit('/Elements/ContentPicker', {
            onBeforeLoad: contentWindow => {
                contentWindow.PROPS = additionalProps;
            },
        });

        cy.getByTestId('be-sub-header').contains('Codepen');
    },
    getContentRow: rowNum => cy.getByTestId('content-picker').find(`.bcp-item-row-${rowNum}`),
    selectRow: row =>
        row
            .click()
            .find('input[type="checkbox"]')
            .should('be.checked'),
    unselectRow: row =>
        row
            .click()
            .find('input[type="checkbox"]')
            .should('not.be.checked'),
};

describe('ContentPicker', () => {
    describe('Selection', () => {
        it('Should be able to select and deselect items', () => {
            helpers.load();

            // Select row 2
            helpers
                .getContentRow(2)
                .as('rowTwo')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowTwo'));

            // Select row 3
            helpers
                .getContentRow(3)
                .as('rowThree')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowThree'));

            // Unselect row 2
            helpers.unselectRow(cy.get('@rowTwo'));

            // Unselect row 3
            helpers.unselectRow(cy.get('@rowThree'));
        });

        it('Should show all the selected items across folders', () => {
            helpers.load();

            // Select row 2
            helpers.selectRow(helpers.getContentRow(2));

            // Explore folder (row 1)
            helpers
                .getContentRow(1)
                .find('button.be-item-label')
                .click();

            cy.getByTestId('be-sub-header').contains('Sample Folder');

            helpers.selectRow(helpers.getContentRow(1));

            // Click the Selected button in the footer
            cy.getByTestId('bcp-selected').click();

            cy.getByTestId('be-sub-header').contains('Selected Items');
            cy.getByTestId('bcp-selected').contains('2 Selected');

            // Unselect the rows
            helpers.getContentRow(1).click();
            helpers.getContentRow(0).click();
            cy.contains('You haven’t selected any items yet.');
        });

        it('Should not allow more than the maximum selected prop', () => {
            helpers.load({ maxSelectable: 2 });

            // Select row 2
            helpers
                .getContentRow(2)
                .as('rowTwo')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowTwo'));

            // Select row 3
            helpers
                .getContentRow(3)
                .as('rowThree')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowThree'));

            cy.getByTestId('bcp-selected').find('.bcp-selected-max');

            // Unselect row 2
            helpers.unselectRow(cy.get('@rowTwo'));

            // Unselect row 3
            helpers.unselectRow(cy.get('@rowThree'));
        });

        it('Should only keep one checked if in single select mode', () => {
            helpers.load({ maxSelectable: 1 });

            // Select row 2
            helpers
                .getContentRow(2)
                .as('rowTwo')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowTwo'));

            // Select row 3
            helpers
                .getContentRow(3)
                .as('rowThree')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(cy.get('@rowThree'));

            // Row 2 should now be unchecked
            cy.get('@rowTwo')
                .find('input[type="checkbox"]')
                .should('not.be.checked');

            cy.getByTestId('bcp-selected').contains('1 Selected');

            // Unselect row 3
            helpers.unselectRow(cy.get('@rowThree'));

            cy.getByTestId('bcp-selected').contains('0 Selected');
        });
    });
});
