// <reference types="Cypress" />
const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#555" height="24" viewBox="0 0 24 24" width="24" focusable="false">
                                                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                            </svg>`;

const blob = new Blob([svg], { type: 'image/svg+xml' });
// Used to simulate an icon URL coming back from the server
const url = URL.createObjectURL(blob);

let callbackStub;
let tabData;

const helpers = {
    load(additionalProps = {}) {
        cy.visit('/Elements/ContentSidebar', {
            onBeforeLoad: contentWindow => {
                contentWindow.PROPS = additionalProps;
            },
        });
    },
    getTabs: () => cy.getByTestId('additionaltab'),
};

describe('additional-tabs', () => {
    beforeEach(() => {
        callbackStub = cy.stub();

        tabData = [
            {
                id: 200,
                title: '1', // used as tooltip
                iconUrl: url,
                callback: callbackStub,
                status: 'ADDED',
            },
            {
                id: 201,
                title: '2',
                iconUrl: url,
                callback: () => {},
                status: 'ADDED',
            },
            {
                id: 202,
                title: '3',
                iconUrl: url,
                callback: () => {},
                status: 'ADDED',
            },
            {
                id: -1,
                title: 'More Apps',
                callback: () => {},
                status: 'ADDED',
            },
        ];
    });

    it('should display nothing when additional tabs are disabled', () => {
        helpers.load({ hasAdditionalTabs: false });

        cy.getByTestId('additionaltabplaceholder').should('not.be.visible');
    });

    it('should display the loading state', () => {
        helpers.load({ hasAdditionalTabs: true, additionalTabs: [] });
        cy.getByTestId('additionaltabplaceholder').should('have.length', 5);
    });

    it('should render the provided icons and tooltips', () => {
        helpers.load({ hasAdditionalTabs: true, additionalTabs: tabData });

        cy.getByTestId('additionaltabplaceholder').should('not.be.visible');

        helpers
            .getTabs()
            .eq(0)
            .trigger('mouseover');

        cy.getTooltip().contains('1');

        helpers
            .getTabs()
            .eq(2)
            .trigger('mouseover');

        // The tabs should be rendering in order
        cy.getTooltip().contains('3');

        helpers
            .getTabs()
            .eq(3)
            .trigger('mouseover');

        // Check that the more items tab rendered as intended
        cy.getTooltip().contains('More Apps');
    });

    it('should execute the given callback on click', () => {
        helpers.load({ hasAdditionalTabs: true, additionalTabs: tabData });

        helpers
            .getTabs()
            .eq(0)
            .click()
            .then(() => expect(callbackStub).to.be.calledWith({ id: 200, callbackData: { status: 'ADDED' } }));
    });

    it('should properly handle a failed icon load', () => {
        tabData[1].iconUrl = 'foobar.jpg';
        helpers.load({ hasAdditionalTabs: true, additionalTabs: tabData });

        cy.getByTestId('additionaltabplaceholder').should('have.length', 1);
    });
});
