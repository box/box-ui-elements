import * as React from 'react';

import userEvent from '@testing-library/user-event';

import { screen, render, within } from '../../../test-utils/testing-library';

import CascadePolicy from '../CascadePolicy';

describe('features/metadata-instance-editor/CascadePolicy', () => {
    beforeEach(() => {
        // reset any previous tests that may have set localStorage
        localStorage.removeItem('aiAgent');
    });

    test('should correctly render cascade policy read only mode', () => {
        render(<CascadePolicy isCascadingEnabled shouldShowCascadeOptions canEdit={false} />);
        expect(
            screen.getByText(
                'This template and its values are being cascaded to all items in this folder and its subfolders.',
            ),
        ).toBeInTheDocument();
    });

    test('should correctly render cascade policy in edit mode', () => {
        render(
            <CascadePolicy
                canEdit
                isCascadingEnabled
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(screen.getByTestId('metadata-cascade-enable')).toBeInTheDocument();
        expect(screen.getByText('Enable Cascade Policy')).toBeInTheDocument();
    });

    test('should correctly render cascade policy in edit mode and overwrite is on', () => {
        render(
            <CascadePolicy
                canEdit
                isCascadingEnabled
                isCascadingOverwritten
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(screen.getByTestId('metadata-cascade-enable')).toBeInTheDocument();
        expect(screen.getByText('Enable Cascade Policy')).toBeInTheDocument();
        expect(screen.getByLabelText('Overwrite')).toBeInTheDocument();
    });

    test('should correctly render cascade policy when the template is Custom Metadata', () => {
        render(
            <CascadePolicy
                canEdit
                isCustomMetadata
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(
            screen.getByText("You cannot apply a cascade policy to this item because it's a custom metadata template."),
        ).toBeInTheDocument();
    });

    test('should render InlineNotice when isExistingCascadePolicy is true', () => {
        render(<CascadePolicy canEdit isExistingCascadePolicy shouldShowCascadeOptions />);
        expect(
            screen.getByText("You cannot apply a cascade policy to this item because it's a custom metadata template."),
        ).toBeInTheDocument();
    });

    test('should render AI folder extraction toggle when canEdit, canUseAIFolderExtraction, and shouldShowCascadeOptions are true', () => {
        render(<CascadePolicy canEdit canUseAIFolderExtraction shouldShowCascadeOptions />);
        expect(screen.getByText('Box AI Autofill')).toBeInTheDocument();
    });

    test.each([
        [false, false, false],
        [true, false, false],
        [false, true, false],
        [true, true, false],
    ])(
        'should not render AI folder extraction toggle when canEdit, canUseAIFolderExtraction, and shouldShowCascadeOptions are %s, %s, and %s',
        (canEdit, canUseAIFolderExtraction, shouldShowCascadeOptions) => {
            render(
                <CascadePolicy
                    canEdit={canEdit}
                    canUseAIFolderExtraction={canUseAIFolderExtraction}
                    shouldShowCascadeOptions={shouldShowCascadeOptions}
                />,
            );
            expect(screen.queryByText('Box AI Autofill')).not.toBeInTheDocument();
        },
    );

    describe('AI Autofill Learn More Link', () => {
        test('should render AI learn more link when AI features are enabled', () => {
            render(<CascadePolicy canEdit canUseAIFolderExtraction shouldShowCascadeOptions />);

            // Find link within the AI autofill section since there are two links with the same text in the component
            const aiSection = screen.getByTestId('ai-folder-extraction');
            const aiLink = within(aiSection).getByText('Learn more');
            expect(aiLink).toBeInTheDocument();
            expect(aiLink.closest('a')).toHaveAttribute('href', 'https://www.box.com/ai');
            expect(aiLink.closest('a')).toHaveAttribute('target', '_blank');
        });
    });

    describe('AI Agent Selector', () => {
        test('should render AI agent selector with default to basic when AI features are enabled', () => {
            render(
                <CascadePolicy
                    canEdit
                    canUseAIFolderExtraction
                    canUseAIFolderExtractionAgentSelector
                    shouldShowCascadeOptions
                />,
            );
            expect(screen.getByRole('combobox', { name: 'Basic' })).toBeInTheDocument();
        });

        test('should not render AI agent selector when canUseAIFolderExtractionAgentSelector is false', () => {
            render(<CascadePolicy canEdit canUseAIFolderExtraction shouldShowCascadeOptions />);
            expect(screen.queryByRole('combobox', { name: 'Basic' })).not.toBeInTheDocument();
        });
    });

    describe('AI Autofill Toggle', () => {
        test('should call onAIFolderExtractionToggle when toggle is clicked and enabled', async () => {
            const onAIFolderExtractionToggle = jest.fn();
            render(
                <CascadePolicy
                    canEdit
                    canUseAIFolderExtraction
                    shouldShowCascadeOptions
                    isExistingAIExtractionCascadePolicy={false}
                    onAIFolderExtractionToggle={onAIFolderExtractionToggle}
                />,
            );
            const aiSection = screen.getByTestId('ai-folder-extraction');
            const toggle = within(aiSection).getByRole('switch');
            await userEvent.click(toggle);
            expect(onAIFolderExtractionToggle).toHaveBeenCalledTimes(1);
            expect(onAIFolderExtractionToggle).toHaveBeenCalledWith(true);
        });
    });
});
