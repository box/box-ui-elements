import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import type { RouteComponentProps } from 'react-router-dom';
import type { MetadataTemplate, MetadataTemplateInstance } from '@box/metadata-editor';
import { screen, render } from '../../../test-utils/testing-library';
import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';
import useMetadataFieldSelection from '../hooks/useMetadataFieldSelection';
import type { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';

jest.mock('../hooks/useSidebarMetadataFetcher');
jest.mock('../hooks/useMetadataFieldSelection');

// Stubbing the editor lets us inspect the props the sidebar hands to it
// without pulling the full @box/metadata-editor form tree into the test.
const mockEditor = jest.fn<null, [MetadataInstanceEditorProps]>(() => null);
jest.mock('../MetadataInstanceEditor', () => ({
    __esModule: true,
    default: (props: MetadataInstanceEditorProps) => mockEditor(props),
}));

const mockUseSidebarMetadataFetcher = useSidebarMetadataFetcher as jest.MockedFunction<
    typeof useSidebarMetadataFetcher
>;
const mockUseMetadataFieldSelection = useMetadataFieldSelection as jest.MockedFunction<
    typeof useMetadataFieldSelection
>;

const mockFile = { id: '123', permissions: { can_upload: true } };
const mockTemplates: MetadataTemplate[] = [
    {
        id: 'metadata_template_custom_1',
        scope: 'global',
        templateKey: 'properties',
        hidden: false,
        fields: [],
        type: 'metadata_template',
    },
];

const taxonomyTemplateInstance = {
    canEdit: true,
    displayName: 'Taxonomy Template',
    fields: [
        {
            id: 'field-1',
            type: 'taxonomy',
            key: 'geography',
            displayName: 'Geography',
            hidden: false,
            levels: [
                { level: 1, displayName: 'Region', description: '' },
                { level: 2, displayName: 'Country', description: '' },
            ],
            optionsRules: { selectableLevels: [1, 2] },
        },
    ],
    hidden: false,
    id: 'taxonomy_instance',
    scope: 'global',
    templateKey: 'taxonomyTemplate',
    type: 'metadata_template',
} as unknown as MetadataTemplateInstance;

const api = { options: { token: jest.fn().mockResolvedValue({ read: 'r', write: 'w' }) } };

const renderSidebar = (features: Record<string, boolean> = {}) => {
    const history = createMemoryHistory({ initialEntries: ['/metadata'] });
    const routerProps = {
        history,
        location: history.location,
        match: { params: {}, isExact: true, path: '/metadata', url: '/metadata' },
    } as unknown as RouteComponentProps;

    const props = {
        api,
        elementId: 'element-1',
        fileExtension: 'pdf',
        fileId: 'file-id-1',
        filteredTemplateIds: [],
        getPreview: jest.fn().mockReturnValue({}),
        isFeatureEnabled: true,
        onError: jest.fn(),
        onSuccess: jest.fn(),
        ...routerProps,
    } satisfies MetadataSidebarRedesignProps;

    return render(<MetadataSidebarRedesign {...props} />, { wrapperProps: { features } });
};

describe('MetadataSidebarRedesign taxonomy picker wiring', () => {
    beforeEach(() => {
        mockEditor.mockClear();

        mockUseMetadataFieldSelection.mockReturnValue({
            selectedMetadataFieldId: null,
            handleSelectMetadataField: jest.fn(),
        });

        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [taxonomyTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });
    });

    const enterEditMode = async () => {
        const editButton = await screen.findByRole('button', { name: /Edit Taxonomy Template/i });
        await userEvent.click(editButton);
    };

    const lastEditorProps = (): MetadataInstanceEditorProps => {
        const { calls } = mockEditor.mock;
        const [firstArg] = calls[calls.length - 1];
        return firstArg;
    };

    test('passes createTaxonomyItemsService to the editor when the picker flag is on', async () => {
        renderSidebar({ 'metadata.taxonomyPicker.enabled': true });
        await enterEditMode();

        const editorProps = lastEditorProps();
        expect(editorProps.isMetadataTaxonomyPickerEnabled).toBe(true);
        expect(editorProps.createTaxonomyItemsService).toEqual(expect.any(Function));
    });

    test('omits createTaxonomyItemsService when the picker flag is off', async () => {
        renderSidebar({ 'metadata.taxonomyPicker.enabled': false });
        await enterEditMode();

        const editorProps = lastEditorProps();
        expect(editorProps.isMetadataTaxonomyPickerEnabled).toBe(false);
        expect(editorProps.createTaxonomyItemsService).toBeUndefined();
    });

    test('service factory resolves field config from the editing template', async () => {
        renderSidebar({ 'metadata.taxonomyPicker.enabled': true });
        await enterEditMode();

        const editorProps = lastEditorProps();
        // The service factory calls resolveField(templateKey, fieldKey); creating
        // the service must not throw when the taxonomy field is in the template.
        expect(() =>
            editorProps.createTaxonomyItemsService?.({
                scope: 'global',
                templateKey: 'taxonomyTemplate',
                fieldKey: 'geography',
            }),
        ).not.toThrow();
    });
});
