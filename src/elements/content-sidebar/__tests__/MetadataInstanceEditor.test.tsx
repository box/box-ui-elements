import React from 'react';
import { MetadataInstanceForm, MetadataTemplateInstance } from '@box/metadata-editor';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor from '../MetadataInstanceEditor';

jest.mock('@box/metadata-editor', () => ({
    MetadataInstanceForm: jest.fn(() => <div data-testid="metadata-instance-form" />),
}));

describe('MetadataInstanceEditor', () => {
    const mockTemplate = {
        id: 'template-id',
        displayName: 'Template Name',
        canEdit: true,
        fields: [],
        scope: 'global',
        templateKey: 'template-id',
        type: 'template-id',
    } as MetadataTemplateInstance;

    test('should render MetadataInstanceForm with correct props', () => {
        render(<MetadataInstanceEditor isAiLoading={false} isBoxAiSuggestionsEnabled={true} template={mockTemplate} />);

        expect(screen.getByTestId('metadata-instance-form')).toBeInTheDocument();
        expect(MetadataInstanceForm).toHaveBeenCalledWith(
            expect.objectContaining({
                isAiSuggestionsFeatureEnabled: true,
                isLoading: false,
                selectedTemplateInstance: mockTemplate,
            }),
            {},
        );
    });
});
