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
            helpers.load({
                features: { versions: true },
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
    });

    describe('activity feed comments', () => {
        const getDraftJSEditor = () => cy.getByTestId('bcs-comment-input-form-container').find('[contenteditable]');
        const getTooltip = () => cy.get('[role="tooltip"]');
        const getCancelButton = () =>
            cy.contains(localize('be.contentSidebar.activityFeed.approvalCommentForm.commentCancel'));

        beforeEach(() => {
            helpers.load({
                fileId: Cypress.env('FILE_ID_DOC'),
            });

            cy.getByTestId('bcs-content').should('exist');
            cy.getByTestId('sidebaractivity').should('have.class', 'bcs-is-selected');
        });

        it('should not show required error if focused and blurred', () => {
            getDraftJSEditor().click();
            getCancelButton();
            getTooltip().should('not.exist');
        });

        it('should show required error if type and then delete text', () => {
            getDraftJSEditor()
                .click()
                .type('qwerty')
                .clear();

            getTooltip().contains(localize('boxui.validation.requiredError'));
        });

        it('should reset validation errors if comment is cancelled', () => {
            getDraftJSEditor()
                .click()
                .type('qwerty')
                .clear();

            getTooltip().contains(localize('boxui.validation.requiredError'));

            getCancelButton().click();

            getDraftJSEditor().click();

            getTooltip().should('not.exist');
        });
    });
});
