import localize from '../../support/i18n';
import utils from '../../support/utils';

// <reference types="Cypress" />
const selectedRowClassName = 'bce-item-row-selected';
const listViewClass = 'bce-item-grid';
const gridViewClass = 'be-ItemGrid';

const helpers = {
    load({ props, features } = {}) {
        cy.visit('/Elements/ContentExplorer', {
            onBeforeLoad: contentWindow => {
                contentWindow.PROPS = props;
                contentWindow.FEATURES = features;
            },
        });
    },
    getSelector(className) {
        return `.${className}`;
    },
    getRow(rowNum) {
        return cy.getByTestId('content-explorer').find(`.bce-item-row-${rowNum}`);
    },
    checkRowSelections(selectedRow) {
        if (selectedRow) {
            cy.getByTestId('content-explorer')
                .find(this.getSelector(selectedRowClassName))
                .should('exist')
                .should('have.class', `bce-item-row-${selectedRow}`);
        } else {
            cy.getByTestId('content-explorer').should('not.have.descendants', this.getSelector(selectedRowClassName));
        }
    },
    selectRow(rowNum) {
        return this.getRow(rowNum).click().should('have.class', selectedRowClassName);
    },
    getAddButton() {
        return cy.getByAriaLabel(localize('be.add'));
    },
    getViewModeChangeButton() {
        return cy.getByTestId('view-mode-change-button');
    },
    // need exact match since 'Upload' appears elsewhere on the page
    getUploadButton() {
        return cy.contains(utils.getExactRegex(localize('be.upload')));
    },
    getNewFolderButton() {
        return cy.contains(localize('be.newFolder'));
    },
    getCancelButton() {
        return cy.contains(localize('be.cancel'));
    },
    // need exact match since 'Close' appears elsewhere on the page
    getCloseButton() {
        return cy.contains(utils.getExactRegex(localize('be.close')));
    },
    getShareButton(rowNum) {
        return this.getRow(rowNum).contains(localize('be.share'));
    },
    getMoreOptionsButton(rowNum) {
        return this.getRow(rowNum).find(`[aria-label="${localize('be.moreOptions')}"]`);
    },
    getAllMoreOptionsButtons() {
        return cy.getByAriaLabel(localize('be.moreOptions'));
    },
    // need exact match since 'Rename' appears elsewhere on the page
    getRenameButton() {
        return cy.contains(utils.getExactRegex(localize('be.rename')));
    },
    getItemNameFromRow(rowNum) {
        return this.getRow(rowNum).find('.be-item-name .be-item-label');
    },
    getClosePreviewButton() {
        return cy.getByAriaLabel(localize('be.close'));
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
        cy.intercept('GET', '**/folders/*', { fixture: 'content-explorer/root-folder.json' });
        cy.intercept('GET', '**/files/319004423111?fields=allowed_shared_link_access_levels,shared_link', {
            type: 'file',
            id: '319004423111',
            etag: '4',
            allowed_shared_link_access_levels: ['collaborators', 'open', 'company'],
            shared_link: null,
        });
        cy.intercept('PUT', '**/files/319004423111', {
            type: 'file',
            id: '319004423111',
            etag: '4',
            allowed_shared_link_access_levels: ['collaborators', 'open', 'company'],
            shared_link: 'www.example.com',
        });
    });

    describe('Selection', () => {
        beforeEach(() => {
            helpers.load();
        });

        it('Should not have a selected row to start', () => {
            helpers.checkRowSelections();
        });

        it('Should be able to select a row', () => {
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
        });

        it('Should change selected rows', () => {
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should open and close upload modal', () => {
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
            helpers.selectRow(2);
            helpers.getAddButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should cancel creating new folder', () => {
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
            helpers.openNewFolderModal();
            helpers.getCancelButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
        });

        it('Should open and close share text', () => {
            helpers.getShareButton(2).click();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
        });

        it('Should preview an item', () => {
            helpers.previewItemFromRow(4);
            helpers.getClosePreviewButton().click();
            helpers.checkRowSelections(4);
            helpers.selectRow(6);
            helpers.checkRowSelections(6);
            helpers.selectRow(2);
            helpers.checkRowSelections(2);
        });

        it('Should open and close rename modal', () => {
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
            helpers.selectRow(1);
            helpers.checkRowSelections(1);
            helpers.selectRow(4);
            helpers.checkRowSelections(4);
            helpers.previewItemFromRow(5);
            helpers.getClosePreviewButton(5).click();
            helpers.checkRowSelections(5);
            helpers.selectRow(6);
            helpers.checkRowSelections(6);
            helpers.openUploadModal();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(6);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.getShareButton(2).click();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(4);
            helpers.checkRowSelections(4);
        });

        it('Should initially show list view', () => {
            cy.getByTestId('content-explorer').find(helpers.getSelector(listViewClass)).should('exist');
            cy.getByTestId('content-explorer').find(helpers.getSelector(gridViewClass)).should('not.exist');
        });
    });

    describe('Grid View', () => {
        beforeEach(() => {
            helpers.load();
            helpers.getViewModeChangeButton().click().blur();
        });

        it('Should switch to grid view', () => {
            cy.getByTestId('content-explorer').find(helpers.getSelector(listViewClass)).should('not.exist');
            cy.getByTestId('content-explorer').find(helpers.getSelector(gridViewClass)).should('exist');
        });

        it('Should open and close share modal', () => {
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('not.exist');
            helpers.getAllMoreOptionsButtons().eq(2).click();
            cy.contains(utils.getExactRegex(localize('be.share'))).click();
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('exist');
            helpers.getCloseButton().click();
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('not.exist');
        });

        it('Should open and close rename modal', () => {
            cy.getByAriaLabel(localize('be.renameDialogLabel')).should('not.exist');
            helpers.getAllMoreOptionsButtons().eq(0).click();
            helpers.getRenameButton().click();
            cy.getByAriaLabel(localize('be.renameDialogLabel')).should('exist');
            helpers.getCancelButton().click();
            cy.getByAriaLabel(localize('be.renameDialogLabel')).should('not.exist');
        });

        it('Should open and close preview', () => {
            cy.getByAriaLabel(localize('be.preview')).should('not.exist');
            cy.contains(Cypress.env('FIRST_FILE_NAME')).click();
            cy.getByAriaLabel(localize('be.preview')).should('exist');
            helpers.getClosePreviewButton().click();
            cy.getByAriaLabel(localize('be.preview')).should('not.exist');
        });
    });
});
