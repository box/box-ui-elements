// <reference types="Cypress" />

describe('ContentSidebar Integration', () => {
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

    describe('restored versions', () => {
        beforeEach(() => {
            cy.server();
            cy.route('GET', '**/files/*', 'fixture:content-sidebar/restored-file.json');
            helpers.load({
                features: { versions: true },
                fileId: Cypress.env('FILE_ID_DOC_VERSIONED'),
            });
        });

        it('should display the current version as restored in the Activity Feed', () => {
            cy.getByTestId('version').within($versionItem => {
                cy.wrap($versionItem).contains('restored version 6');
            });
        });

        it('should display the current version as restored in Version History', () => {
            cy.getByTestId('sidebardetails').click();
            cy.getByTestId('versionhistory').click();
            cy.contains('[data-testid="bcs-content"]', 'Version History').as('versionHistory');
            cy.get('@versionHistory').contains('Restored by');
        });
    });
});
