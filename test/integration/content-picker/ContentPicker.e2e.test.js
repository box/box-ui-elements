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
    getRow: rowNum => cy.getByTestId('content-picker').find(`.bcp-item-row-${rowNum}`),
    selectRow(rowNum, rowType = 'checkbox') {
        this.getRow(rowNum)
            .as('row')
            .click()
            .find(`input[type="${rowType}"]`)
            .should('be.checked');

        cy.get('@row').find('.bcp-shared-access-select');

        return cy.get('@row');
    },
    unselectRow(rowNum, rowType = 'checkbox') {
        this.getRow(rowNum)
            .as('row')
            .click()
            .find(`input[type="${rowType}"]`)
            .should('not.be.checked');

        cy.get('@row')
            .find('.bcp-shared-access-select')
            .should('not.exist');

        return cy.get('@row');
    },
};

describe('ContentPicker', () => {
    beforeEach(() => {
        cy.server();

        cy.route('GET', '**/folders/*', 'fixture:content-picker/root-folder.json');

        ['319004423111', '308566419514', '308409990441'].forEach(fileId => {
            cy.fixture('content-picker/get-sharedlink.json').then(getSharedLinkJson => {
                cy.route('GET', `**/files/${fileId}?fields=allowed_shared_link_access_levels,shared_link`, {
                    ...getSharedLinkJson,
                    id: fileId,
                });
            });

            cy.fixture('content-picker/create-sharedlink.json').then(createSharedLinkJson => {
                cy.route('PUT', `**/files/${fileId}`, {
                    ...createSharedLinkJson,
                    id: fileId,
                });
            });
        });
    });

    describe('Selection', () => {
        it('Should be able to select and deselect items', () => {
            helpers.load();

            // Select row 2
            helpers
                .getRow(2)
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(2);

            // Select row 3
            helpers
                .getRow(3)
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(3);

            // Unselect row 2
            helpers.unselectRow(2);

            // Unselect row 3
            helpers.unselectRow(3);
        });

        it('Should show all the selected items across folders', () => {
            helpers.load();

            // Select row 2
            helpers.selectRow(2);

            // Override the route stubbing for a sub folder
            cy.route('GET', '**/folders/*', 'fixture:content-picker/sample-folder.json');

            // Explore folder (row 1)
            helpers
                .getRow(1)
                .find('button.be-item-label')
                .click();

            cy.getByTestId('be-sub-header').contains('Sample Folder');

            helpers.selectRow(1);

            // Click the Selected button in the footer
            cy.contains('2 Selected').click();
            cy.getByTestId('be-sub-header').contains('Selected Items');

            // Unselect the rows
            helpers.getRow(1).click();
            helpers.getRow(0).click();
            cy.contains('You haven’t selected any items yet.');
        });

        it('Should not allow more than the maximum selected prop', () => {
            helpers.load({ maxSelectable: 2 });

            // Select row 2
            helpers
                .getRow(2)
                .as('rowTwo')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(2);

            // Select row 3
            helpers
                .getRow(3)
                .as('rowThree')
                .find('input[type="checkbox"]')
                .should('not.be.checked');
            helpers.selectRow(3);

            cy.contains('2 Selected').find('.bcp-selected-max');

            // Unselect row 2
            helpers.unselectRow(2);

            // Unselect row 3
            helpers.unselectRow(3);
        });

        it('Should only keep one checked if in single select mode', () => {
            helpers.load({ maxSelectable: 1 });

            // Select row 2
            helpers
                .getRow(2)
                .as('rowTwo')
                .find('input[type="radio"]')
                .should('not.be.checked');
            helpers.selectRow(2, 'radio');

            // Select row 3
            helpers
                .getRow(3)
                .as('rowThree')
                .find('input[type="radio"]')
                .should('not.be.checked');
            helpers.selectRow(3, 'radio');

            // Row 2 should now be unchecked
            cy.get('@rowTwo')
                .find('input[type="radio"]')
                .should('not.be.checked');

            // Unselect row 3
            helpers.unselectRow(3, 'radio');
        });
    });
});
