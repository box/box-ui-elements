import React from 'react';
import { type MetadataTemplateInstance } from '@box/metadata-editor';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

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

    const mockMetadataTemplateInstance: MetadataTemplateInstance = {
        ...mockCustomMetadataTemplate,
        displayName: 'Template Name',
    };

    const defaultProps: MetadataInstanceEditorProps = {
        isBoxAiSuggestionsEnabled: true,
        isUnsavedChangesModalOpen: false,
        template: mockMetadataTemplateInstance,
        onCancel: jest.fn(),
        onDelete: jest.fn(),
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
});
