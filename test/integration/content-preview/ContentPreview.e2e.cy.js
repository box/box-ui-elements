// <reference types="Cypress" />
import l from '../../support/i18n';

describe('ContentPreview', () => {
    const helpers = {
        checkPreviewHeader() {
            cy.get('.bcpr-PreviewHeader').should('be.visible');
        },
        checkVersionsHeader() {
            cy.get('.bcpr-PreviewHeader--basic').should('be.visible');
        },
        selectVersion(versionName) {
            cy.getByTestId('versions-item-button').contains(versionName).click();
        },
    };

    const storybookIdWithSidebar = 'elements-contentpreview-tests-e2e--with-sidebar';

    describe('Sanity', () => {
        it('The sidebar should not render when sidebar props are omitted', () => {
            cy.visitStorybook('elements-contentpreview-tests-e2e--no-sidebar');

            // Gives time for sidebar chunk to potentially load, it shouldn't in this case
            cy.wait(3000); // eslint-disable-line cypress/no-unnecessary-waiting
            cy.get('.bcs').should('not.exist');
        });

        it('The sidebar should render when given sidebar props', () => {
            cy.visitStorybook(storybookIdWithSidebar);

            // Sidebar should exist
            cy.get('.bcs').should('exist');
        });

        it('The sidebar should be open by default only on large screens', () => {
            const breakpoints = [
                [300, 'not.exist'],
                [600, 'not.exist'],
                [800, 'not.exist'],
                [1000, 'not.exist'],
                [1200, 'exist'],
                [1500, 'exist'],
                [2000, 'exist'],
                [1500, 'exist'],
                [1200, 'exist'],
                [1000, 'not.exist'],
                [800, 'not.exist'],
                [600, 'not.exist'],
                [300, 'not.exist'],
            ];

            cy.visitStorybook(storybookIdWithSidebar);

            breakpoints.forEach(([width, assertion]) => {
                cy.viewport(width, 600);
                cy.getByTestId('bcs-content').should(assertion);
            });
        });

        it('The sidebar should open on a small screen if a user clicks a sidebar tab', () => {
            cy.visitStorybook(storybookIdWithSidebar);

            cy.viewport(800, 600);
            cy.getByTestId('bcs-content').should('not.exist');
            cy.getByTestId('sidebaractivity').click();
            cy.getByTestId('bcs-content').should('exist');

            // Sidebar should stay open if you click Next File in a collection
            cy.getByTitle('Next File').click();
            cy.getByTestId('bcs-content').should('exist');
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            cy.visitStorybook(storybookIdWithSidebar);
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
            cy.getByTestId('sidebartoggle').click();
            cy.getByTestId('bcs-content').should('not.exist');

            // Closing the sidebar sometimes leaves the focus on the Show/Hide Sidebar button
            // Where the label covers the "Next File" element. This fix prevents flakiness.
            cy.get('.bcpr-PreviewMask').should('exist');
            cy.get('.bcpr-PreviewMask').type('{rightarrow}');

            // Navigating between files in a collection should retain the prior closed state
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

            // Click the sidebar toggle button to toggle it closed
            cy.getByTestId('sidebartoggle').click();
            cy.getByTestId('bcs-content').should('not.exist');
        });
    });

    describe('Previous Versions', () => {
        beforeEach(() => {
            cy.visitStorybook('elements-contentpreview-tests-e2e--file-version');

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
            cy.contains(l('be.back')).click();
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
