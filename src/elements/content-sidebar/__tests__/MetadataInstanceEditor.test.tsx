import React from 'react';
import { MetadataTemplateInstance } from '@box/metadata-editor';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

describe('MetadataInstanceEditor', () => {
    // const mockTemplate: MetadataTemplateInstance = {
    //     id: 'template-id',
    //     displayName: 'Template Name',
    //     canEdit: true,
    //     fields: [],
    //     scope: 'global',
    //     templateKey: 'template-id',
    //     type: 'template-id',
    // };

    const mockCustomMetadata: MetadataTemplateInstance = {
        id: 'template-id',
        canEdit: true,
        fields: [],
        scope: 'global',
        templateKey: 'template-id',
        type: 'template-id',
    };

    const mockDefinedTemplate: MetadataTemplateInstance = { ...mockCustomMetadata, displayName: 'Template Name' };

    const defaultProps: MetadataInstanceEditorProps = {
        isAiLoading: false,
        isBoxAiSuggestionsEnabled: true,
        isDismissModalOpen: false,
        template: mockDefinedTemplate,
    };

    test('should render MetadataInstanceForm with correct props', () => {
        render(<MetadataInstanceEditor {...defaultProps} />);

        const templateHeader = screen.getByText(mockDefinedTemplate.displayName);
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render MetadataInstanceForm with Custom Template', () => {
        const props = { ...defaultProps, template: mockCustomMetadata };
        render(<MetadataInstanceEditor {...props} />);

        const templateHeader = screen.getByText('Custom Metadata');
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render UnsavedChangesModal if isDismissModalOpen is true', () => {
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

        const props = { ...defaultProps, isDismissModalOpen: true };
        render(<MetadataInstanceEditor {...props} />);

        const unsavedChangesModal = screen.getByText('Unsaved Changes');
        screen.debug();
        expect(unsavedChangesModal).toBeInTheDocument();
    });
});
