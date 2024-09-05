import React from 'react';
import { type MetadataTemplate } from '@box/metadata-editor';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

describe('MetadataInstanceEditor', () => {
    const mockCustomMetadataTemplate: MetadataTemplate = {
        id: 'template-id',
        fields: [],
        scope: 'global',
        templateKey: 'properties',
        type: 'template-id',
        hidden: false,
    };

    const mockMetadataTemplate: MetadataTemplate = { ...mockCustomMetadataTemplate, displayName: 'Template Name' };

    const defaultProps: MetadataInstanceEditorProps = {
        isBoxAiSuggestionsEnabled: true,
        isUnsavedChangesModalOpen: false,
        template: mockMetadataTemplate,
    };

    test('should render MetadataInstanceForm with correct props', () => {
        render(<MetadataInstanceEditor {...defaultProps} />);

        const templateHeader = screen.getByText(mockMetadataTemplate.displayName);
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
