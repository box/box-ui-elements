// Specify Annotations version in command line, otherwise defaults to the latest version
// e.g. CYPRESS_ANNOTATIONS_VERSION=4.0.0-beta.24 yarn test:e2e:open
const ANNOTATIONS_VERSION = Cypress.env('ANNOTATIONS_VERSION') ? `@${Cypress.env('ANNOTATIONS_VERSION')}` : '';

import(`https://unpkg.com/box-annotations${ANNOTATIONS_VERSION}/dist/annotations.js`);

describe('ContentPreview with Annotations', () => {
    const helpers = {
        load({ features, fileId, props } = {}) {
            cy.visit('/Elements/ContentPreview', {
                onBeforeLoad: contentWindow => {
                    contentWindow.FEATURES = {
                        activityFeed: {
                            annotations: {
                                enabled: true,
                            },
                        },
                        ...features,
                    };
                    contentWindow.FILE_ID = fileId;
                    contentWindow.PROPS = {
                        showAnnotations: true,
                        ...props,
                    };

                    const { document } = contentWindow;
                    const { head } = document;

                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = `https://unpkg.com/box-annotations${ANNOTATIONS_VERSION}/dist/annotations.css`;
                    head.appendChild(link);
                },
            });
        },
        clickAnnotationLinkByComment(comment) {
            return cy
                .contains(comment)
                .siblings()
                .filter('[data-testid="bcs-AnnotationActivity-link"]')
                .click();
        },
    };

    it('Should scroll to annotations', () => {
        helpers.load({
            fileId: Cypress.env('FILE_ID_DOC_ANNOTATIONS'),
            props: {
                boxAnnotations: new global.BoxAnnotations(),
            },
        });

        // Region target is on the first page
        cy.get('.ba-RegionAnnotation').should('be.visible');
        // Highlight target is on the second page
        cy.get('.ba-HighlightTarget-rect').should('not.be.visible');

        // Click highlight annotation in the sidebar to trigger scrolling
        helpers.clickAnnotationLinkByComment('Highlight Annotation on version 2');

        cy.get('.ba-RegionAnnotation').should('not.be.visible');
        cy.get('.ba-HighlightTarget-rect').should('be.visible');

        // Click region annotation in the sidebar to scroll back
        helpers.clickAnnotationLinkByComment('Region Annotation on version 2');

        cy.get('.ba-RegionAnnotation').should('be.visible');
        cy.get('.ba-HighlightTarget-rect').should('not.be.visible');
    });

    it('Should show annotations on previous versions', () => {
        helpers.load({
            fileId: Cypress.env('FILE_ID_DOC_ANNOTATIONS'),
            props: {
                boxAnnotations: new global.BoxAnnotations(),
            },
        });

        // Click an annotation on previous version
        helpers.clickAnnotationLinkByComment('Region Annotations');

        // Previous versions header
        cy.get('.bcpr-PreviewHeader--basic').should('be.visible');

        // Assert annotations render on previous versions
        cy.get('.ba-RegionAnnotation').should('exist');

        // Click an annotation on current versoin
        helpers.clickAnnotationLinkByComment('Region Annotation on version 2');

        // Current version header
        cy.get('.bcpr-PreviewHeader').should('be.visible');
    });

    it('Should show drawing annotations', () => {
        helpers.load({
            fileId: Cypress.env('FILE_ID_DOC_ANNOTATIONS'),
            props: {
                boxAnnotations: new global.BoxAnnotations(null, { features: { drawing: true } }),
            },
        });

        cy.get('.ba-DrawingTarget')
            .should('be.visible')
            .rightclick() // prevent jumping to hyperlink of <a>
            .should('have.class', 'is-active');
    });
});
