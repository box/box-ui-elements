import React from 'react';
import type { MetadataTemplateInstance } from '@box/metadata-editor';
import { render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { type MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

const mockMetadataInstanceForm = jest.fn<null, [Record<string, unknown>]>(() => null);

// Stubbing MetadataInstanceForm lets us inspect the props handed to @box/metadata-editor
// without rendering the real (possibly yarn-linked) package form tree.
jest.mock('@box/metadata-editor', () => ({
    __esModule: true,
    MetadataInstanceForm: (props: Record<string, unknown>) => mockMetadataInstanceForm(props),
}));

describe('MetadataInstanceEditor user field wiring', () => {
    const template = {
        id: 'template-id',
        displayName: 'Template Name',
        fields: [],
        scope: 'global',
        templateKey: 'customTemplate',
        type: 'metadata_template',
        hidden: false,
        canEdit: true,
    } as unknown as MetadataTemplateInstance;

    const defaultProps: MetadataInstanceEditorProps = {
        areAiSuggestionsAvailable: true,
        isBetaLanguageEnabled: false,
        isBoxAiSuggestionsEnabled: true,
        isDeleteButtonDisabled: false,
        isDeleteConfirmationModalCheckboxEnabled: false,
        isLargeFile: false,
        isMetadataMultiLevelTaxonomyFieldEnabled: false,
        isUnsavedChangesModalOpen: false,
        onCancel: jest.fn(),
        onDelete: jest.fn(),
        onDiscardUnsavedChanges: jest.fn(),
        onSubmit: jest.fn(),
        setIsUnsavedChangesModalOpen: jest.fn(),
        taxonomyOptionsFetcher: jest.fn(),
        template,
    };

    const lastFormProps = (): Record<string, unknown> => {
        const { calls } = mockMetadataInstanceForm.mock;
        const [firstArg] = calls[calls.length - 1];
        return firstArg;
    };

    beforeEach(() => {
        mockMetadataInstanceForm.mockClear();
    });

    test('disables the user field by default', () => {
        render(<MetadataInstanceEditor {...defaultProps} />);

        expect(lastFormProps()).toEqual(expect.objectContaining({ isUserFieldEnabled: false }));
    });

    test('passes isUserFieldEnabled, fetchUsers and fetchAvatarUrls through to MetadataInstanceForm', () => {
        const fetchUsers = jest.fn();
        const fetchAvatarUrls = jest.fn();

        render(
            <MetadataInstanceEditor
                {...defaultProps}
                fetchAvatarUrls={fetchAvatarUrls}
                fetchUsers={fetchUsers}
                isMetadataUserFieldEnabled
            />,
        );

        expect(lastFormProps()).toEqual(
            expect.objectContaining({
                fetchAvatarUrls,
                fetchUsers,
                isUserFieldEnabled: true,
            }),
        );
    });
});
