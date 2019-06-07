import localize from '../../support/i18n';

// <reference types="Cypress" />
const selectedRowClassName = 'bce-item-row-selected';
const selectedRowClassSelector = `.${selectedRowClassName}`;
const helpers = {
    load(additionalProps = {}) {
        cy.visit('/Elements/ContentExplorer', {
            onBeforeLoad: contentWindow => {
                contentWindow.PROPS = additionalProps;
            },
        });
    },
    // cy.contains('Upload') returns the 'canUpload' help text
    // at the bottom of the page, as opposed to the Upload button.
    // Use this function when you need cy.contains() to match exact text.
    getExactRegex(str) {
        return new RegExp(`^${str}$`);
    },
    getRow(rowNum) {
        return cy.getByTestId('content-explorer').find(`.bce-item-row-${rowNum}`);
    },
    checkRowSelections(selectedRow) {
        if (selectedRow) {
            cy.getByTestId('content-explorer')
                .find(`${selectedRowClassSelector}`)
                .should('have.length', 1)
                .should('have.class', `bce-item-row-${selectedRow}`);
        } else {
            cy.getByTestId('content-explorer').should('not.have.descendants', selectedRowClassSelector);
        }
    },
    selectRow(rowNum) {
        this.getRow(rowNum)
            .as('row')
            .click()
            .should('have.class', selectedRowClassName);
        return cy.get('@row');
    },
    getAddButton() {
        return cy.getByTestId('be-btn-add');
    },
    getUploadButton() {
        return cy.contains(this.getExactRegex(localize('be.upload')));
    },
    getNewFolderButton() {
        return cy.contains(localize('be.newFolder'));
    },
    getCancelButton() {
        return cy.contains(localize('be.cancel'));
    },
    getCloseButton() {
        return cy.contains(localize('be.close'));
    },
    getShareButton(rowNum) {
        return this.getRow(rowNum).contains(localize('be.share'));
    },
    getMoreOptionsButton(rowNum) {
        return this.getRow(rowNum).find('[data-testid="bce-btn-more-options"]');
    },
    getRenameButton() {
        return cy.contains(this.getExactRegex(localize('be.rename')));
    },
    getItemNameFromRow(rowNum) {
        return this.getRow(rowNum).find('[data-testid="be-item-name"]');
    },
    getClosePreviewButton() {
        return cy.getByTestId('bcpr-btn-close');
    },
    openUploadModal() {
        this.getAddButton().click();
        this.getUploadButton().click();
    },
    openNewFolderModal() {
        this.getAddButton().click();
        this.getNewFolderButton().click();
    },
    previewItemFromRow(rowNum) {
        this.getItemNameFromRow(rowNum).click();
    },
};

describe('ContentExplorer', () => {
    beforeEach(() => {
        cy.server();
        cy.route('GET', '**/folders/*', 'fixture:content-explorer/root-folder.json');
    });

    describe('Selection', () => {
        it('Should not have a selected row to start', () => {
            helpers.load();
            helpers.checkRowSelections();
        });

        it('Should be able to select a row', () => {
            helpers.load();
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
        });

        it('Should change selected rows', () => {
            helpers.load();
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should open and close upload modal', () => {
            helpers.load();
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
            helpers.openUploadModal();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(1);
            helpers.checkRowSelections(1);
        });

        it('Should click add button and then select new row', () => {
            helpers.load();
            helpers.selectRow(2);
            helpers.getAddButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should cancel creating new folder', () => {
            helpers.load();
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
            helpers.openNewFolderModal();
            helpers.getCancelButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
        });

        it('Should open and close share text', () => {
            helpers.load();
            helpers.getShareButton(2).click();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should preview an item', () => {
            helpers.load();
            helpers.previewItemFromRow(4);
            helpers.getClosePreviewButton().click();
            helpers.checkRowSelections(4);
            helpers.selectRow(6);
            helpers.checkRowSelections(6);
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
        });

        it('Should open and close rename modal', () => {
            helpers.load();
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
            helpers.getMoreOptionsButton(4).click();
            helpers.getRenameButton().click();
            helpers.getCancelButton().click();
            helpers.checkRowSelections(4);
            helpers.selectRow(1);
            helpers.checkRowSelections(1);
        });

        it('Should perform multiple operations in sequence', () => {
            helpers.load();
            helpers.selectRow(1);
            helpers.checkRowSelections(1);
            helpers.selectRow(4);
            helpers.checkRowSelections(4);
            helpers.previewItemFromRow(2);
            helpers.getClosePreviewButton(2).click();
            helpers.checkRowSelections(2);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
            helpers.openUploadModal();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(5);
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
            helpers.getShareButton(3).click();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(3);
            helpers.selectRow(4);
            helpers.checkRowSelections(4);
        });
    });
});
