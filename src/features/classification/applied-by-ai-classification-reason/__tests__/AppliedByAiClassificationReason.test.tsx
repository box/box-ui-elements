import * as React from 'react';

import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import AppliedByAiClassificationReason from '../AppliedByAiClassificationReason';

import messages from '../messages';

describe('AppliedByAiClassificationReason', () => {
    let defaultProps;
    let modifiedAtDisplayDate;

    beforeEach(() => {
        defaultProps = {
            answer: 'This file is marked as Internal Only because it contains non-public financial results.',
            modifiedAt: '2024-01-15T10:30:00Z',
        };
        modifiedAtDisplayDate = 'January 15, 2024';
    });

    const renderComponent = (props = {}) => {
        return render(<AppliedByAiClassificationReason {...defaultProps} {...props} />);
    };

    test('should render AI classification reason with icon, applied date, and reasoning', () => {
        const expectedIconSize = '1.25rem';

        renderComponent();

        const boxAiIcon = screen.getByTestId('box-ai-icon');
        const appliedByWithDate = screen.getByRole('heading', {
            level: 3,
            name: messages.appliedByBoxAiOnDate.defaultMessage.replace('{modifiedAt}', modifiedAtDisplayDate),
        });
        const reasonText = screen.getByText(defaultProps.answer);
        const citationsLabel = screen.queryByTestId('content-answers-references-label');
        const noReferencesIconContainer = screen.queryByTestId('content-answers-references-no-references');

        expect(boxAiIcon).toBeVisible();
        expect(boxAiIcon).toHaveAttribute('height', expectedIconSize);
        expect(boxAiIcon).toHaveAttribute('width', expectedIconSize);
        expect(appliedByWithDate).toBeVisible();
        expect(reasonText).toBeVisible();
        // Assert none of the Reference components are rendered
        expect(citationsLabel).toBeNull();
        expect(noReferencesIconContainer).toBeNull();
    });

    test('should render no references icon and display tooltip on hover when provided empty citations array', async () => {
        const user = userEvent();
        renderComponent({ citations: [] });

        const noReferencesIconContainer = screen.getByTestId('content-answers-references-no-references');
        const noReferencesIcon = noReferencesIconContainer.querySelector('svg');

        // Verify the icon is visible
        expect(noReferencesIcon).toBeVisible();

        // Verify tooltip appears on hover
        await user.hover(noReferencesIconContainer);

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveTextContent('Response based on general document analysis');
    });

    test('should render references when provided non-empty citations', () => {
        const expectedCitationsCount = 5;
        const expectedCitations = Array.from({ length: expectedCitationsCount }, () => ({
            content: 'file content for citation',
            fileId: 'fileId',
            location: 'cited location',
            title: 'file title',
        }));

        renderComponent({ citations: expectedCitations });

        const citationsLabel = screen.queryByTestId('content-answers-references-label');
        const citationElements = screen.getAllByTestId('content-answers-citation-status');

        expect(citationsLabel).toBeVisible();
        expect(citationElements).toHaveLength(expectedCitationsCount);
    });

    test.each([null, undefined, 'invalid date str'])(
        'should render applied by without date when modifiedAt is invalid: %s',
        invalidModifiedAt => {
            renderComponent({ modifiedAt: invalidModifiedAt });

            const appliedByWithoutDate = screen.getByRole('heading', {
                level: 3,
                name: messages.appliedByBoxAi.defaultMessage,
            });

            expect(appliedByWithoutDate).toBeVisible();
        },
    );

    test('should render long answer text correctly', () => {
        const longAnswer = 'A'.repeat(1000);
        renderComponent({ answer: longAnswer });

        expect(screen.getByText(longAnswer)).toBeVisible();
    });

    test('should render answer with special and unicode characters correctly', () => {
        const nonPlainAnswer = 'Answer with special characters and unicode !@#$%^&*()_+-=[]{}|;:,.<>? 🚀🌟🎉中文日本語';

        renderComponent({ answer: nonPlainAnswer });

        const reasonText = screen.getByText(nonPlainAnswer);

        expect(reasonText).toBeVisible();
    });
});
