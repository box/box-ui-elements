import localize from '../../support/i18n';
import utils from '../../support/utils';
import { GRID_VIEW_MAX_COLUMNS, GRID_VIEW_MIN_COLUMNS } from '../../../src/constants';

// <reference types="Cypress" />
const selectedRowClassName = 'bce-item-row-selected';
const listViewClass = 'bce-item-grid';
const gridViewClass = 'bdl-GridView';

const gridViewOn = {
    contentExplorer: {
        gridView: {
            enabled: true,
        },
    },
};

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
        return this.getRow(rowNum)
            .click()
            .should('have.class', selectedRowClassName);
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
    // using data-testid since more options button has "..." for text
    getMoreOptionsButton(rowNum) {
        return this.getRow(rowNum).find('[data-testid="bce-btn-more-options"]');
    },
    getAllMoreOptionsButtons() {
        return cy.get('[data-testid="bce-btn-more-options"]');
    },
    // need exact match since 'Rename' appears elsewhere on the page
    getRenameButton() {
        return cy.contains(utils.getExactRegex(localize('be.rename')));
    },
    // using data-testid since name is different from row to row
    getItemNameFromRow(rowNum) {
        return this.getRow(rowNum).find('[data-testid="be-item-name"]');
    },
    getClosePreviewButton() {
        return cy.getByAriaLabel(localize('be.close'));
    },
    getSliderPlusButton() {
        return cy.getByAriaLabel(localize('be.gridView.increaseColumnSize'));
    },
    getSliderMinusButton() {
        return cy.getByAriaLabel(localize('be.gridView.decreaseColumnSize'));
    },
    getGridViewColumnCount() {
        return cy
            .get('.bdl-GridView-row')
            .eq(0)
            .find('.bdl-GridViewSlot')
            .its('length');
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
        cy.route('GET', '**/files/319004423111?fields=allowed_shared_link_access_levels,shared_link', {
            type: 'file',
            id: '319004423111',
            etag: '4',
            allowed_shared_link_access_levels: ['collaborators', 'open', 'company'],
            shared_link: null,
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
            helpers.previewItemFromRow(2);
            helpers.getClosePreviewButton(2).click();
            helpers.checkRowSelections(2);
            helpers.selectRow(5);
            helpers.checkRowSelections(5);
            helpers.openUploadModal();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(5);
            helpers.selectRow(3);
            helpers.checkRowSelections(3);
            helpers.getShareButton(2).click();
            helpers.getCloseButton().click();
            helpers.checkRowSelections(2);
            helpers.selectRow(4);
            helpers.checkRowSelections(4);
        });

        it('Should initially show list view', () => {
            cy.getByTestId('content-explorer')
                .find(helpers.getSelector(listViewClass))
                .should('exist');
            cy.getByTestId('content-explorer')
                .find(helpers.getSelector(gridViewClass))
                .should('not.exist');
        });
    });

    describe('Grid View', () => {
        beforeEach(() => {
            // Done to ensure that grid view can display GRID_VIEW_MAX_COLUMNS
            cy.viewport(2560, 1440);
            helpers.load({ features: gridViewOn });
            helpers
                .getViewModeChangeButton()
                .click()
                .blur();
        });

        it('Should switch to grid view', () => {
            cy.getByTestId('content-explorer')
                .find(helpers.getSelector(listViewClass))
                .should('not.exist');
            cy.getByTestId('content-explorer')
                .find(helpers.getSelector(gridViewClass))
                .should('exist');
        });

        it('Should open and close share modal', () => {
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('not.exist');
            helpers
                .getAllMoreOptionsButtons()
                .eq(2)
                .click();
            cy.contains(utils.getExactRegex(localize('be.share'))).click();
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('exist');
            helpers.getCloseButton().click();
            cy.getByAriaLabel(localize('be.shareDialogLabel')).should('not.exist');
        });

        it('Should open and close rename modal', () => {
            cy.getByAriaLabel(localize('be.renameDialogLabel')).should('not.exist');
            helpers
                .getAllMoreOptionsButtons()
                .eq(0)
                .click();
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

        it('Should increase number of columns', () => {
            helpers.getGridViewColumnCount().then(numColumns => {
                helpers.getSliderMinusButton().click();
                helpers.getGridViewColumnCount().should('equal', numColumns + 1);
            });
        });

        it('Should decrease number of columns', () => {
            helpers.getGridViewColumnCount().then(numColumns => {
                helpers.getSliderPlusButton().click();
                helpers.getGridViewColumnCount().should('equal', numColumns - 1);
            });
        });

        it('Should cycle through all slider values, always staying within column restraints', () => {
            helpers.getGridViewColumnCount().then(numColumns => {
                for (let i = 0; i < GRID_VIEW_MAX_COLUMNS + 1; i += 1) {
                    helpers.getSliderPlusButton().click();
                    helpers.getGridViewColumnCount().should('equal', Math.max(numColumns - 1, GRID_VIEW_MIN_COLUMNS));
                    numColumns -= 1;
                }
                numColumns = GRID_VIEW_MIN_COLUMNS;
                for (let i = 0; i < GRID_VIEW_MAX_COLUMNS + 1; i += 1) {
                    helpers.getSliderMinusButton().click();
                    helpers.getGridViewColumnCount().should('equal', Math.min(numColumns + 1, GRID_VIEW_MAX_COLUMNS));
                    numColumns += 1;
                }
                numColumns = GRID_VIEW_MAX_COLUMNS;
                for (let i = 0; i < GRID_VIEW_MAX_COLUMNS + 1; i += 1) {
                    helpers.getSliderPlusButton().click();
                    helpers.getGridViewColumnCount().should('equal', Math.max(numColumns - 1, GRID_VIEW_MIN_COLUMNS));
                    numColumns -= 1;
                }
            });
        });
    });
});
