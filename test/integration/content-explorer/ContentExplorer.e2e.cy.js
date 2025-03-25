/// <reference types="Cypress" />

const helpers = {
    load(props = {}) {
        cy.visit('/Elements/ContentExplorer', {
            onBeforeLoad: contentWindow => {
                contentWindow.PROPS = props;
            },
        });
    },
    getElementByLabel(label, role) {
        if (role) {
            return this.getExplorer().find(`[aria-label="${label}"][role="${role}"]`);
        }
        return this.getExplorer().find(`[aria-label="${label}"]`);
    },
    getElementBySelector(selector) {
        return this.getElementBySelector(selector).first();
    },
    getElementByText(text, selector) {
        if (selector) {
            return this.getExplorer().contains(selector, text);
        }
        return this.getExplorer().contains(text);
    },
    getElementsBySelector(selector) {
        return this.getExplorer().find(selector);
    },
    getExplorer() {
        return cy.getByTestId('content-explorer');
    },
    getListItemByIndex(index) {
        return this.getElementBySelector('.be-ItemList-item').eq(index);
    },
    getListItemByName(name) {
        return this.getElementByText(name, '.be-ItemList-item');
    },
    getGridItemByIndex(index) {
        return this.getElementBySelector('.be-ItemGrid-item').eq(index);
    },
    getGridItemByName(name) {
        return this.getElementByText(name, '.be-ItemGrid-item');
    },
};

describe('ContentExplorer', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/folders/*', { fixture: 'common/root-folder.json' });
        cy.intercept('GET', '**/files/308339768087?fields=allowed_shared_link_access_levels,shared_link', {
            type: 'file',
            id: '308339768087',
            etag: '2',
            allowed_shared_link_access_levels: ['collaborators', 'open', 'company'],
            shared_link: 'https://app.box.com',
        });
    });

    describe('Collection', () => {
        beforeEach(() => {
            helpers.load();
        });

        it('Should initially display content in list view', () => {
            helpers.getElementByLabel('List view', 'grid').should('exist');
            helpers.getElementByLabel('Grid view').should('not.exist');

            // Root folder contains 11 items
            helpers.getElementsBySelector('.be-ItemList-item').should('have.length', 11);
        });

        it('Should switch to display content in grid view', () => {
            helpers.getElementByLabel('Switch to Grid View').click();

            helpers.getElementByLabel('List view').should('not.exist');
            helpers.getElementByLabel('Grid view', 'grid').should('exist');
        });

        it('Should click header button and open upload dialog', () => {
            helpers.getElementByLabel('Upload', 'dialog').should('not.exist');

            helpers.getElementByLabel('Add').click();
            cy.get('[role="menu"]').contains('[role="menuitem"]', 'Upload').click();

            helpers.getElementByLabel('Upload', 'dialog').should('exist');
        });

        it('Should click header button and open create folder dialog', () => {
            helpers.getElementByLabel('New Folder', 'dialog').should('not.exist');

            helpers.getElementByLabel('Add').click();
            cy.get('[role="menu"]').contains('[role="menuitem"]', 'New Folder').click();

            helpers.getElementByLabel('New Folder', 'dialog').should('exist');
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            helpers.load();
        });

        it('Should click row item to open folder and view content', () => {
            helpers.getElementsBySelector('.be-ItemList-item').should('have.length', 11);

            cy.intercept('GET', '**/folders/*', { fixture: 'common/sample-folder.json' });

            helpers.getListItemByName('Sample Folder').click();

            helpers.getElementByText('Sample Folder', '.be-breadcrumb').should('exist');

            // Subfolder contains 3 items
            helpers.getElementsBySelector('.be-ItemList-item').should('have.length', 3);
        });

        it('Should click breadcrumb item to navigate to folder', () => {
            helpers.getElementByText('CodePen', '.be-breadcrumb').should('exist');
            helpers.getElementByText('Sample Folder', '.be-breadcrumb').should('not.exist');

            cy.intercept('GET', '**/folders/*', { fixture: 'common/sample-folder.json' });

            helpers.getListItemByName('Sample Folder').click();

            // All Files > CodePen > Sample Folder
            helpers.getElementByText('CodePen', '.be-breadcrumb').should('exist');
            helpers.getElementByText('Sample Folder', '.be-breadcrumb').should('exist');

            cy.intercept('GET', '**/folders/*', { fixture: 'common/root-folder.json' });

            helpers.getElementByText('CodePen', '.be-breadcrumb').click();

            // All Files > CodePen
            helpers.getElementByText('CodePen', '.be-breadcrumb').should('exist');
            helpers.getElementByText('Sample Folder', '.be-breadcrumb').should('not.exist');
        });
    });

    describe('Item Interaction', () => {
        beforeEach(() => {
            helpers.load();
        });

        it('Should click row item to preview file', () => {
            helpers.getElementByLabel('Preview', 'dialog').should('not.exist');

            helpers.getListItemByName('Sample Document.pdf').click();

            helpers.getElementByLabel('Preview', 'dialog').should('exist');
        });

        it('Should click row item to preview file in grid view', () => {
            helpers.getElementByLabel('Switch to Grid View').click();

            helpers.getElementByLabel('Preview', 'dialog').should('not.exist');

            helpers.getGridItemByName('Sample Document.pdf').click();

            helpers.getElementByLabel('Preview', 'dialog').should('exist');
        });

        it('Should click row actions and open share dialog', () => {
            helpers.getElementByLabel('Share', 'dialog').should('not.exist');

            helpers.getListItemByName('Sample Document.pdf').find('[aria-label="More options"]').click();
            cy.get('[role="menu"]').contains('[role="menuitem"]', 'Share').click();

            helpers.getElementByLabel('Share', 'dialog').should('exist');
        });

        it('Should click row actions and open rename dialog', () => {
            helpers.getElementByLabel('Rename', 'dialog').should('not.exist');

            helpers.getListItemByName('Sample Document.pdf').find('[aria-label="More options"]').click();
            cy.get('[role="menu"]').contains('[role="menuitem"]', 'Rename').click();

            helpers.getElementByLabel('Rename', 'dialog').should('exist');
        });
    });
});
