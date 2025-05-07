// <reference types="Cypress" />

const helpers = {
    getTestFile(filename, type) {
        const fixturePath = `content-uploader/${filename}`;
        return cy.window().then(win =>
            cy
                .fixture(fixturePath, 'base64')
                .then(Cypress.Blob.base64StringToBlob)
                .then(blob => {
                    const testFile = new win.File([blob], filename, { type });
                    const dataTransfer = new win.DataTransfer();
                    dataTransfer.items.add(testFile);
                    return dataTransfer;
                }),
        );
    },
};

describe('ContentUploader', () => {
    describe('Add files', () => {
        beforeEach(() => {
            cy.visitStorybook('elements-contentuploader--basic');
        });

        it('Should not have duplicated file name', () => {
            const inputSelector = '.be-input-link input';
            const dropSelector = '.bcu-droppable-content';
            const filename = 'test.pdf';
            const type = 'application/pdf';

            helpers.getTestFile(filename, type).then(dataTransfer => {
                cy.get(inputSelector).then(subject => {
                    const el = subject[0];
                    el.files = dataTransfer.files;
                    cy.wrap(subject).trigger('change', { force: true });
                });

                // eslint-disable-next-line cypress/unsafe-to-chain-command
                cy.get(dropSelector)
                    .first()
                    .trigger('dragenter', {
                        dataTransfer,
                    })
                    .trigger('drop', {
                        dataTransfer: {
                            items: [
                                {
                                    ...dataTransfer.items[0],
                                    webkitGetAsEntry: () => ({
                                        file: successCallback => successCallback(dataTransfer.files[0]),
                                    }),
                                },
                            ],
                        },
                    });
            });

            cy.get('.bcu-item-label').should('have.length', 1);
        });
    });
});
