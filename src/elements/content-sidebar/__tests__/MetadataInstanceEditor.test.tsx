import React from 'react';
import { type MetadataTemplateInstance } from '@box/metadata-editor';
import userEvent from '@testing-library/user-event';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

const mockOnCancel = jest.fn();
const mockOnDiscardUnsavedChanges = jest.fn();
const mockSetIsUnsavedChangesModalOpen = jest.fn();

describe('MetadataInstanceEditor', () => {
    const mockCustomMetadataTemplate: MetadataTemplateInstance = {
        id: 'template-id',
        fields: [],
        scope: 'global',
        templateKey: 'properties',
        type: 'template-id',
        hidden: false,
        canEdit: true,
    };

    const mockMetadataTemplate: MetadataTemplateInstance = {
        ...mockCustomMetadataTemplate,
        displayName: 'Template Name',
        canEdit: true,
    };

    const mockCustomMetadataTemplateWithField: MetadataTemplateInstance = {
        id: 'template-id',
        fields: [
            {
                id: '1',
                type: 'string',
                key: 'signature',
                hidden: false,
                displayName: 'Signature',
            },
        ],
        scope: 'global',
        templateKey: 'customTemplate',
        type: 'template-id',
        hidden: false,
        canEdit: true,
    };

    const mockMetadataTemplateInstance: MetadataTemplateInstance = {
        ...mockCustomMetadataTemplate,
        displayName: 'Template Name',
    };

    const defaultProps: MetadataInstanceEditorProps = {
        areAiSuggestionsAvailable: true,
        fetchSuggestions: jest.fn(),
        isBoxAiSuggestionsEnabled: true,
        isDeleteButtonDisabled: false,
        isUnsavedChangesModalOpen: false,
        onCancel: mockOnCancel,
        onDelete: jest.fn(),
        onDiscardUnsavedChanges: mockOnDiscardUnsavedChanges,
        onSubmit: jest.fn(),
        setIsUnsavedChangesModalOpen: mockSetIsUnsavedChangesModalOpen,
        taxonomyOptionsFetcher: jest.fn(),
        template: mockMetadataTemplate,
    };

    test('should render MetadataInstanceForm with correct props', () => {
        render(<MetadataInstanceEditor {...defaultProps} />);

        const templateHeader = screen.getByText(mockMetadataTemplateInstance.displayName);
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render MetadataInstanceForm with Custom Template', () => {
        const props = { ...defaultProps, template: mockCustomMetadataTemplate };
        render(<MetadataInstanceEditor {...props} />);

        const templateHeader = screen.getByText('Custom Metadata');
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render UnsavedChangesModal if isUnsavedChangesModalOpen is true', async () => {
        const props = { ...defaultProps, isUnsavedChangesModalOpen: true };
        const { findByText } = render(<MetadataInstanceEditor {...props} />);

        const unsavedChangesModal = await findByText('Unsaved Changes');
        expect(unsavedChangesModal).toBeInTheDocument();
    });

    test('should render MetadataInstanceForm with Delete button disabled', () => {
        const props = { ...defaultProps, isDeleteButtonDisabled: true };
        render(<MetadataInstanceEditor {...props} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeDisabled();
    });

    test('should render MetadataInstanceForm with Delete button enabled', () => {
        render(<MetadataInstanceEditor {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeEnabled();
    });

    test('Should call onCancel when canceling editing', async () => {
        const props: MetadataInstanceEditorProps = { ...defaultProps, template: mockCustomMetadataTemplate };
        const { findByRole } = render(<MetadataInstanceEditor {...props} />);
        const cancelButton = await findByRole('button', { name: 'Cancel' });

        await userEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    test('Should call onDiscardUnsavedChanges instead onCancel when canceling through UnsavedChangesModal', async () => {
        const props: MetadataInstanceEditorProps = {
            ...defaultProps,
            template: mockCustomMetadataTemplateWithField,
        };
        const { rerender, findByRole, findByText } = render(<MetadataInstanceEditor {...props} />);
        const input = await findByRole('textbox');
        const cancelButton = await findByRole('button', { name: 'Cancel' });

        await userEvent.type(input, 'Lorem ipsum dolor.');
        await userEvent.click(cancelButton);

        expect(mockOnCancel).not.toHaveBeenCalled();
        expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(true);

        rerender(<MetadataInstanceEditor {...props} isUnsavedChangesModalOpen={true} />);
        const unsavedChangesModal = await findByText('Unsaved Changes');

        expect(unsavedChangesModal).toBeInTheDocument();
        const unsavedChangesModalDiscardButton = await findByRole('button', { name: 'Discard Changes' });

        await userEvent.click(unsavedChangesModalDiscardButton);

        expect(mockOnDiscardUnsavedChanges).toHaveBeenCalled();
    });
});
