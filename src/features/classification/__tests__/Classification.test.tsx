import * as React from 'react';

import { render, screen, waitFor } from '../../../test-utils/testing-library';
import Classification from '../Classification';

import messages from '../messages';
import securityControlsMessages from '../security-controls/messages';

// Preload component to prevent lazy loading issues with Jest
import '../applied-by-ai-classification-reason/AppliedByAiClassificationReason';

describe('features/classification/Classification', () => {
    let classificationLabelName;
    let defaultProps;
    let definition;
    let modifiedAt;
    let modifiedBy;

    beforeEach(() => {
        classificationLabelName = 'Confidential';
        definition = 'fubar';
        modifiedAt = '2024-01-15T10:30:00Z';
        modifiedBy = 'TestUser';

        defaultProps = {
            name: classificationLabelName,
            definition,
            messageStyle: 'inline',
        };
    });

    const renderComponent = (props = {}) => render(<Classification {...defaultProps} {...props} />);

    test('should render a classified badge with definition for inline message style', () => {
        renderComponent();

        const badgeHeading = screen.getByRole('heading', { level: 1, name: classificationLabelName });
        const definitionLabel = screen.getByText(messages.definition.defaultMessage);
        const definitionDetail = screen.getByText(definition);

        expect(badgeHeading).toBeVisible();
        expect(definitionLabel).toBeVisible();
        expect(definitionDetail).toBeVisible();
    });

    test('should render a classified badge with no definition', () => {
        renderComponent({
            definition: undefined,
        });

        const badgeHeading = screen.getByRole('heading', { level: 1, name: classificationLabelName });
        const definitionText = screen.queryByText(messages.definition.defaultMessage);

        expect(badgeHeading).toBeVisible();
        expect(definitionText).not.toBeInTheDocument();
    });

    test('should not render any elements when classification does not exist for tooltip message style', () => {
        const { container } = renderComponent({
            name: undefined,
            messageStyle: 'tooltip',
        });

        expect(container.firstChild).toBeEmptyDOMElement();
    });

    test('should render not classified message when there is no classification for inline message style', () => {
        renderComponent({
            name: undefined,
        });

        const missingMessage = screen.getByText(messages.missing.defaultMessage);

        expect(missingMessage).toBeVisible();
    });

    test('should render a classified badge without definition for tooltip message style', () => {
        renderComponent({
            name: classificationLabelName,
            definition,
            messageStyle: 'tooltip',
        });

        const badgeHeading = screen.getByRole('heading', { level: 1, name: classificationLabelName });
        const definitionLabel = screen.queryByText(messages.definition.defaultMessage);

        expect(badgeHeading).toBeVisible();
        expect(definitionLabel).not.toBeInTheDocument();
    });

    test.each(['tooltip', 'inline'])(
        'should render a classified badge with click functionality for %s message style',
        messageStyle => {
            renderComponent({
                name: classificationLabelName,
                definition,
                messageStyle,
                onClick: jest.fn(),
            });

            const buttonElement = screen.getByRole('button', { name: classificationLabelName });

            expect(buttonElement).toBeVisible();
        },
    );

    test('should not render classification last modified details when modified props are not provided', () => {
        renderComponent();

        const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');

        expect(modifiedByDetailsSection).not.toBeInTheDocument();
    });

    test('should not render classification last modified details when modified props are provided in tooltip message style', () => {
        renderComponent({
            messageStyle: 'tooltip',
            modifiedAt,
            modifiedBy,
        });

        const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');

        expect(modifiedByDetailsSection).not.toBeInTheDocument();
    });

    test.each`
        isImportedClassification | expectedMessageText
        ${undefined}             | ${'Applied by TestUser on January 15, 2024'}
        ${false}                 | ${'Applied by TestUser on January 15, 2024'}
        ${true}                  | ${'Imported from TestUser on January 15, 2024'}
    `(
        `should render classification last modified plaintext details as "$expectedMessageText" when provided
        modified props and isImportedClassification $isImportedClassification for inline message style`,
        ({ isImportedClassification, expectedMessageText }) => {
            renderComponent({
                isImportedClassification,
                modifiedAt,
                modifiedBy,
            });

            const modifiedByClassificationLabel = screen.getByText(messages.modifiedByLabel.defaultMessage);
            const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');
            const messageText = screen.getByText(expectedMessageText);
            const appliedByTitle = screen.queryByText(messages.appliedByTitle.defaultMessage);

            expect(modifiedByClassificationLabel).toBeVisible();
            expect(modifiedByDetailsSection).toBeVisible();
            expect(messageText).toBeVisible();

            // Assert the alternative text labels is not used when associated prop (shouldUseAppliedByLabels) is not provided
            expect(appliedByTitle).not.toBeInTheDocument();
        },
    );

    test('should render security controls when provided for inline message style', () => {
        renderComponent({
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });

        const restrictionsLabel = screen.getByText(securityControlsMessages.securityControlsLabel.defaultMessage);
        const sharingRestriction = screen.getByText(securityControlsMessages.shortSharing.defaultMessage);

        expect(restrictionsLabel).toBeVisible();
        expect(sharingRestriction).toBeVisible();
    });

    test('should not render security controls for tooltip message style', () => {
        renderComponent({
            messageStyle: 'tooltip',
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });

        const restrictionsLabel = screen.queryByText(securityControlsMessages.securityControlsLabel.defaultMessage);
        const sharingRestriction = screen.queryByText(securityControlsMessages.shortSharing.defaultMessage);

        expect(restrictionsLabel).not.toBeInTheDocument();
        expect(sharingRestriction).not.toBeInTheDocument();
    });

    test('should render loading indicator when isLoadingControls is true and controls are not provided', () => {
        renderComponent({
            isLoadingControls: true,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(1);
        expect(loadingIndicators[0]).toBeVisible();
    });

    test('should render loading indicator when isLoadingControls is true and controls are provided', () => {
        renderComponent({
            isLoadingControls: true,
            controls: {
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            },
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(1);
        expect(loadingIndicators[0]).toBeVisible();
    });

    test('should not render loading indicator for security controls when item is not classified', () => {
        renderComponent({
            name: undefined,
            messageStyle: 'inline',
            isLoadingControls: true,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(0);
    });

    test('should not render loading indicator for security controls when not inline message style', () => {
        renderComponent({
            messageStyle: 'tooltip',
            isLoadingControls: true,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(0);
    });

    test.each([true, false, undefined])(
        'should render AI reasoning with expected label when provided aiClassificationReason prop regardless of shouldUseAppliedByLabels value: %s',
        async shouldUseAppliedByLabels => {
            const expectedCitationsCount = 5;
            const expectedCitations = Array.from({ length: expectedCitationsCount }, () => ({
                content: 'file content for citation',
                fileId: 'fileId',
                location: 'cited location',
                title: 'file title',
            }));

            const aiClassificationReason = {
                answer: 'This file is marked as Internal Only because it contains non-public financial results.',
                modifiedAt,
                citations: expectedCitations,
            };

            renderComponent({
                aiClassificationReason,
                modifiedAt: '2024-01-30T10:30:00Z', // This prop is ignored when using aiClassificationReason
                modifiedBy: 'Box AI Service', // This prop is ignored when using aiClassificationReason
                shouldUseAppliedByLabels,
            });

            // Wait for the async component to load
            await waitFor(() => {
                const appliedByTitle = screen.getByText(messages.appliedByTitle.defaultMessage);
                const appliedByDetails = screen.getByText('Box AI on January 15, 2024'); // expected text based on provided mocks
                const reasonText = screen.getByText(aiClassificationReason.answer);
                const citationsLabel = screen.queryByTestId('content-answers-references-label');
                const citationElements = screen.getAllByTestId('content-answers-citation-status');
                const modifiedByPlaintext = screen.queryByTestId('classification-modifiedby');

                expect(appliedByTitle).toBeVisible();
                expect(appliedByDetails).toBeVisible();
                expect(reasonText).toBeVisible();
                expect(citationsLabel).toBeVisible();
                expect(citationElements).toHaveLength(expectedCitationsCount);

                // Assert the plaintext version of modified by details is not rendered
                expect(modifiedByPlaintext).not.toBeInTheDocument();
            });
        },
    );

    test('should render modification details using Applied By format when shouldUseAppliedByLabels is true', () => {
        renderComponent({
            shouldUseAppliedByLabels: true,
            modifiedAt,
            modifiedBy,
        });

        const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');
        const appliedByTitle = screen.getByText(messages.appliedByTitle.defaultMessage);
        const appliedByDetails = screen.getByText('TestUser on January 15, 2024');
        const modifiedByClassificationLabel = screen.queryByText(messages.modifiedByLabel.defaultMessage);
        const longModifiedByText = screen.queryByText('Applied by TestUser on January 15, 2024');

        expect(modifiedByDetailsSection).toBeVisible();
        expect(appliedByTitle).toBeVisible();
        expect(appliedByDetails).toBeVisible();

        // Assert the default modification detail format is not rendered
        expect(modifiedByClassificationLabel).not.toBeInTheDocument();
        expect(longModifiedByText).not.toBeInTheDocument();
    });

    test('should render modification details using Applied By format for imported classification when shouldUseAppliedByLabels is true', () => {
        renderComponent({
            shouldUseAppliedByLabels: true,
            isImportedClassification: true,
            modifiedAt,
            modifiedBy,
        });

        const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');
        const appliedByTitle = screen.getByText(messages.appliedByTitle.defaultMessage);
        const appliedByDetails = screen.getByText('TestUser on January 15, 2024');
        const modifiedByClassificationLabel = screen.queryByText(messages.modifiedByLabel.defaultMessage);
        const importedDetailText = screen.queryByText('Imported from TestUser on January 15, 2024');

        expect(modifiedByDetailsSection).toBeVisible();
        expect(appliedByTitle).toBeVisible();
        expect(appliedByDetails).toBeVisible();

        // Assert the default modification detail format is not rendered
        expect(modifiedByClassificationLabel).not.toBeInTheDocument();
        expect(importedDetailText).not.toBeInTheDocument();
    });

    test.each`
        testDescription                      | modifiedAtParam   | modifiedByParam
        ${'when modifiedAt is invalid date'} | ${'invalid-date'} | ${modifiedBy}
        ${'when modifiedAt is empty string'} | ${''}             | ${modifiedBy}
        ${'when modifiedBy is not provided'} | ${modifiedAt}     | ${undefined}
        ${'when modifiedAt is not provided'} | ${undefined}      | ${modifiedBy}
    `('should not render modification details $testDescription', ({ modifiedAtParam, modifiedByParam }) => {
        renderComponent({
            modifiedAt: modifiedAtParam,
            modifiedBy: modifiedByParam,
        });

        const modifiedByDetailsSection = screen.queryByTestId('classification-modifiedby');

        expect(modifiedByDetailsSection).not.toBeInTheDocument();
    });

    test('should render loading indicator when isLoadingAppliedBy is true when provided base modification details', () => {
        renderComponent({
            isLoadingAppliedBy: true,
            modifiedAt,
            modifiedBy,
            shouldUseAppliedByLabels: true,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');
        const appliedByTitle = screen.getByText(messages.appliedByTitle.defaultMessage);

        expect(loadingIndicators).toHaveLength(1);
        expect(loadingIndicators[0]).toBeVisible();
        expect(appliedByTitle).toBeVisible();
    });

    test('should render loading indicator when isLoadingAppliedBy is true without base modification details', () => {
        renderComponent({
            isLoadingAppliedBy: true,
            modifiedAt: undefined,
            modifiedBy: undefined,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');
        const appliedByTitle = screen.getByText(messages.appliedByTitle.defaultMessage);
        const modifiedByClassificationLabel = screen.queryByText(messages.modifiedByLabel.defaultMessage);

        expect(loadingIndicators).toHaveLength(1);
        expect(loadingIndicators[0]).toBeVisible();
        expect(appliedByTitle).toBeVisible();

        // Assert the non-applied by label is not used applied by is being loaded
        expect(modifiedByClassificationLabel).not.toBeInTheDocument();
    });

    test('should not render loading indicator for applied by when item is not classified', () => {
        renderComponent({
            name: undefined,
            messageStyle: 'inline',
            isLoadingAppliedBy: true,
            modifiedAt,
            modifiedBy,
        });

        const loadingIndicator = document.querySelectorAll('.crawler');

        expect(loadingIndicator).toHaveLength(0);
    });

    test('should not render loading indicator for applied by when not inline message style', () => {
        renderComponent({
            messageStyle: 'tooltip',
            isLoadingAppliedBy: true,
            modifiedAt,
            modifiedBy,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(0);
    });

    test('should render two loading indicators when both isLoadingAppliedBy and isLoadingControls are true', () => {
        renderComponent({
            isLoadingAppliedBy: true,
            isLoadingControls: true,
            modifiedAt,
            modifiedBy,
        });

        const loadingIndicators = document.querySelectorAll('.crawler');

        expect(loadingIndicators).toHaveLength(2);
        expect(loadingIndicators[0]).toBeVisible();
        expect(loadingIndicators[1]).toBeVisible();
    });
});
