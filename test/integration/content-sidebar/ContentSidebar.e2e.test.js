// <reference types="Cypress" />
import localize from '../../support/i18n';

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

    describe('navigation buttons', () => {
        beforeEach(() => {
            helpers.load({
                fileId: Cypress.env('FILE_ID_SKILLS'),
            });
        });

        it('should toggle sidebar content when a user toggles a sidebar tab', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            cy.getByTestId('sidebarskills').click();
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
            cy.getByTestId('bcs-content').should('not.exist');

            cy.getByTestId('sidebarskills').click();
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');
            cy.getByTestId('bcs-content').should('exist');
        });

        it('should switch the sidebar panel when a user navigates between tabs', () => {
            // Sidebar should be open by default
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            cy.getByTestId('sidebaractivity').click();
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
        });

        it('should switch the sidebar panel when a user navigates between tabs using keyboard', () => {
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            cy.getByTestId('sidebarskills').trigger('keydown', { key: 'ArrowDown' });
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
            cy.getByTestId('sidebarmetadata').should('have.class', 'bcs-is-selected');
            cy.focused().should('have.attr', 'data-testid', 'sidebarmetadata');

            cy.getByTestId('sidebarskills').trigger('keydown', { key: 'ArrowUp' });
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');
            cy.getByTestId('sidebarmetadata').should('not.have.class', 'bcs-is-selected');
            cy.focused().should('have.attr', 'data-testid', 'sidebarskills');

            cy.getByTestId('sidebarskills').trigger('keydown', { key: 'ArrowRight' });
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');
            cy.focused().should('have.attr', 'data-testid', 'sidebarskills');
        });

        it('should toggle sidebar content when a user clicks the toggle sidebar button', () => {
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            cy.getByTestId('sidebartoggle').click();
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
            cy.getByTestId('bcs-content').should('not.exist');

            cy.getByTestId('sidebartoggle').click();
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');
            cy.getByTestId('bcs-content').should('exist');
        });

        it('should toggle sidebar content when using a combination of toggle sidebar button and sidebar tab', () => {
            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebarskills').should('have.class', 'bcs-is-selected');

            cy.getByTestId('sidebartoggle').click();
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
            cy.getByTestId('bcs-content').should('not.exist');

            cy.getByTestId('sidebaractivity').click();
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');
            cy.getByTestId('sidebarskills').should('not.have.class', 'bcs-is-selected');
        });
    });

    describe('version history', () => {
        beforeEach(() => {
            cy.server();
            cy.route('GET', '**/files/*', 'fixture:content-sidebar/restored-file.json');

            helpers.load({
                fileId: Cypress.env('FILE_ID_DOC_VERSIONED'),
            });
        });

        it('should show and hide when a user navigates to and from it', () => {
            cy.getByTestId('sidebardetails').click();
            cy.getByTestId('versionhistory').click();
            cy.contains('[data-testid="bcs-content"]', 'Version History').as('versionHistory');

            cy.getByTestId('versions-item-button').within($versionsItem => {
                cy.wrap($versionsItem)
                    .contains('V2')
                    .click();
                cy.wrap($versionsItem).should('have.class', 'bcs-is-selected');
            });

            cy.get('@versionHistory')
                .contains('Back')
                .click();
            cy.get('@versionHistory').should('not.exist');
        });

        it('should display the current version as restored', () => {
            cy.getByTestId('version').within($versionItem => {
                cy.wrap($versionItem).contains('promoted v6 to v10');
            });
            cy.getByTestId('sidebardetails').click();
            cy.getByTestId('versionhistory').click();

            cy.contains('[data-testid="bcs-content"]', 'Version History').as('versionHistory');
            cy.get('@versionHistory').contains('Restored by');
        });
    });

    describe('activity feed comments', () => {
        const getDraftJSEditor = () => cy.getByTestId('bcs-CommentForm-body').find('[contenteditable]');
        const getTooltip = () => cy.get('[role="tooltip"]');
        const getCancelButton = () => cy.contains(localize('be.contentSidebar.activityFeed.commentForm.commentCancel'));

        beforeEach(() => {
            helpers.load({
                fileId: Cypress.env('FILE_ID_DOC'),
            });

            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');
        });

        it('Comment form validation', () => {
            // should not show validation error if focused and then blurred
            getDraftJSEditor().click();
            getCancelButton();
            getTooltip().should('not.exist');

            // should show required error if type and then delete text
            getDraftJSEditor()
                .click()
                .type('qwerty')
                .clear();

            getTooltip().contains(localize('boxui.validation.requiredError'));

            // should reset validation state after clicking "Cancel" and focusing again
            getCancelButton().click();
            getDraftJSEditor().click();
            getTooltip().should('not.exist');
        });
    });
});
