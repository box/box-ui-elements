// <reference types="Cypress" />
const COLLECTION = [
    Cypress.env('FILE_ID_DOC_VERSIONED'),
    Cypress.env('FILE_ID_DOC'),
    Cypress.env('FILE_ID_SKILLS'),
    Cypress.env('FILE_ID_VIDEO'),
];

describe('ContentPreview', () => {
    const helpers = {
        load({ features, fileId } = {}) {
            cy.visit('/Elements/ContentPreview', {
                onBeforeLoad: contentWindow => {
                    contentWindow.FEATURES = features;
                    contentWindow.FILE_ID = fileId;
                    contentWindow.PROPS = {
                        collection: COLLECTION,
                    };
                },
            });
        },
        checkPreviewHeader() {
            cy.getByTestId('previewheader')
                .as('previewheader')
                .contains('Document - Versioned (PDF).pdf');

            cy.get('@previewheader').should('not.contain', 'Back');
        },
        checkVersionsHeader() {
            cy.getByTestId('previewheader')
                .as('previewheader')
                .contains('Document - Versioned.docx');

            cy.get('@previewheader').contains('Back');
        },
        selectVersion(versionName) {
            cy.getByTestId('versions-item-button').within($versionsItem => {
                cy.wrap($versionsItem)
                    .contains(versionName)
                    .click();
            });
        },
    };

    describe('Navigation', () => {
        beforeEach(() => {
            helpers.load({
                features: { versions: true },
                fileId: Cypress.env('FILE_ID_SKILLS'),
            });
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
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            // Navigate to previous file should default to activity feed
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');
        });

        it('Navigating from file to file, tab should stick to prior chosen tab if it exists', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            // Skills tab should be selected
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');
            // Select the details tab
            cy.getByTestId('sidebardetails').click();

            // Navigate to previous file should keep details tab selected
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('not.have.class', 'bcs-is-selected');
            cy.getByTestId('sidebardetails').should('have.class', 'bcs-is-selected');
        });

        it('Navigating from file to file, should be able to toggle tab after tab switch based on order of preference', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            // Skills tab should be selected
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            // Navigate to previous file should default to activity feed
            cy.getByTitle('Previous File').click();
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');

            // Click the activity tab to toggle it closed
            cy.getByTestId('sidebaractivity').click();
            cy.getByTestId('bcs-content').should('not.exist');
        });
    });

    describe('Previous Versions', () => {
        beforeEach(() => {
            helpers.load({
                features: { versions: true },
                fileId: Cypress.env('FILE_ID_DOC_VERSIONED'),
            });

            // Preview an older version via the sidebar
            cy.getByTestId('sidebardetails').click();
            cy.getByTestId('versionhistory').click();
            cy.contains('[data-testid="bcs-content"]', 'Version History');

            helpers.selectVersion('V2');
            helpers.checkVersionsHeader();
        });

        it('Toggling between previous and current versions should show the correct header', () => {
            helpers.selectVersion('Current');
            helpers.checkPreviewHeader();
        });
        it('Clicking the back button while previewing a previous version should return to the current version', () => {
            cy.getByTestId('versionsheaderback').click();
            helpers.checkPreviewHeader();
        });
        it('Clicking the back arrow while previewing a previous version should return to the current version', () => {
            cy.get('.bdl-BackButton').click();
            helpers.checkPreviewHeader();
        });
        it('Navigating while previewing a previous version should preview the current version of the next file', () => {
            cy.getByTitle('Next File').click();
            helpers.checkPreviewHeader();
        });
    });
});
