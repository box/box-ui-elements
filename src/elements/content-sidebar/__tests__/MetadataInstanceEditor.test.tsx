import React from 'react';
import { type MetadataTemplateInstance } from '@box/metadata-editor';
import { screen, render, fireEvent, act } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

const mockOnCancel = jest.fn();
const mockOnUnsavedChangesModalCancel = jest.fn();
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
        isBoxAiSuggestionsEnabled: true,
        isDeleteButtonDisabled: false,
        isUnsavedChangesModalOpen: false,
        template: mockMetadataTemplate,
        onCancel: mockOnCancel,
        onDelete: jest.fn(),
        onSubmit: jest.fn(),
        setIsUnsavedChangesModalOpen: mockSetIsUnsavedChangesModalOpen,
        onUnsavedChangesModalCancel: mockOnUnsavedChangesModalCancel,
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

    test('should render UnsavedChangesModal if isUnsavedChangesModalOpen is true', () => {
        // Mock window.matchMedia to simulate media query behavior for this test,
        // as the UnsavedChangesModal component relies on it.
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        const props = { ...defaultProps, isUnsavedChangesModalOpen: true };
        render(<MetadataInstanceEditor {...props} />);

        const unsavedChangesModal = screen.getByText('Unsaved Changes');
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

    test('Should call onCancel when canceling editing', () => {
        const props: MetadataInstanceEditorProps = { ...defaultProps, template: mockCustomMetadataTemplate };
        const { getByRole } = render(<MetadataInstanceEditor {...props} />);

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Cancel' }));
        });

        expect(mockOnCancel).toHaveBeenCalled();
    });

    test('Should call onUnsavedChangesModalCancel instead onCancel when canceling through UnsavedChangesModal', () => {
        const props: MetadataInstanceEditorProps = { ...defaultProps, template: mockCustomMetadataTemplateWithField };
        const { getByRole, rerender } = render(<MetadataInstanceEditor {...props} />);
        const input = getByRole('textbox');

        act(() => {
            fireEvent.change(input, { target: { value: 'Lorem ipsum dolor.' } });
            fireEvent.click(getByRole('button', { name: 'Cancel' }));
        });

        expect(mockOnCancel).not.toHaveBeenCalled();
        expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(true);

        rerender(<MetadataInstanceEditor {...props} isUnsavedChangesModalOpen={true} />);
        const unsavedChangesModal = screen.getByText('Unsaved Changes');
        expect(unsavedChangesModal).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByRole('button', { name: 'Cancel' }));
        });
        expect(mockOnUnsavedChangesModalCancel).toHaveBeenCalled();
    });
});
