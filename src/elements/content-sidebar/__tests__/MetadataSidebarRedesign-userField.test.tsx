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

// Stubbing the package components keeps this test independent of the real
// @box/metadata-editor build (which crashes under jest when yarn-linked,
// due to a duplicate React instance).
jest.mock('@box/metadata-editor', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- jest.mock factories are hoisted above imports, so React must be required lazily
    const ReactLib = require('react');

    return {
        AddMetadataTemplateDropdown: () => null,
        AutofillContextProvider: ({ children }) => children,
        FilterInstancesDropdown: () => null,
        MetadataEmptyState: () => null,
        MetadataInstanceList: ({ onEdit, templateInstances }) =>
            ReactLib.createElement(
                'div',
                null,
                templateInstances.map(instance =>
                    ReactLib.createElement(
                        'button',
                        { key: instance.id, onClick: () => onEdit(instance) },
                        `Edit ${instance.displayName}`,
                    ),
                ),
            ),
    };
});

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

const userFieldTemplateInstance = {
    canEdit: true,
    displayName: 'User Template',
    fields: [
        {
            id: 'field-1',
            type: 'user',
            key: 'owner',
            displayName: 'Owner',
            hidden: false,
        },
    ],
    hidden: false,
    id: 'user_instance',
    scope: 'global',
    templateKey: 'userTemplate',
    type: 'metadata_template',
} as unknown as MetadataTemplateInstance;

const api = { options: { token: jest.fn().mockResolvedValue({ read: 'r', write: 'w' }) } };

const renderSidebar = (
    features: Record<string, boolean> = {},
    overrideProps: Partial<MetadataSidebarRedesignProps> = {},
) => {
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
        ...overrideProps,
    } satisfies MetadataSidebarRedesignProps;

    return render(<MetadataSidebarRedesign {...props} />, { wrapperProps: { features } });
};

describe('MetadataSidebarRedesign user field wiring', () => {
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
            templateInstances: [userFieldTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });
    });

    const enterEditMode = async () => {
        const editButton = await screen.findByRole('button', { name: /Edit User Template/i });
        await userEvent.click(editButton);
    };

    const lastEditorProps = (): MetadataInstanceEditorProps => {
        const { calls } = mockEditor.mock;
        const [firstArg] = calls[calls.length - 1];
        return firstArg;
    };

    test('passes the flag and fetchers to the editor when the user field flag is on', async () => {
        renderSidebar({ 'metadata.userField.enabled': true });
        await enterEditMode();

        const editorProps = lastEditorProps();
        expect(editorProps.isMetadataUserFieldEnabled).toBe(true);
        expect(editorProps.fetchUsers).toEqual(expect.any(Function));
        expect(editorProps.fetchAvatarUrls).toEqual(expect.any(Function));
    });

    test('keeps the user field disabled when the flag is off', async () => {
        renderSidebar({ 'metadata.userField.enabled': false });
        await enterEditMode();

        // Fetchers are always provided; @box/metadata-editor gates rendering on the flag.
        const editorProps = lastEditorProps();
        expect(editorProps.isMetadataUserFieldEnabled).toBe(false);
        expect(editorProps.fetchUsers).toEqual(expect.any(Function));
        expect(editorProps.fetchAvatarUrls).toEqual(expect.any(Function));
    });

    test('prefers host-provided fetcher overrides over the default API fetchers', async () => {
        const fetchUsers = jest.fn();
        const fetchAvatarUrls = jest.fn();

        renderSidebar({ 'metadata.userField.enabled': true }, { fetchAvatarUrls, fetchUsers });
        await enterEditMode();

        const editorProps = lastEditorProps();
        expect(editorProps.fetchUsers).toBe(fetchUsers);
        expect(editorProps.fetchAvatarUrls).toBe(fetchAvatarUrls);
    });

    test('falls back to the default fetcher for any override the host does not provide', async () => {
        const fetchUsers = jest.fn();

        renderSidebar({ 'metadata.userField.enabled': true }, { fetchUsers });
        await enterEditMode();

        const editorProps = lastEditorProps();
        expect(editorProps.fetchUsers).toBe(fetchUsers);
        expect(editorProps.fetchAvatarUrls).toEqual(expect.any(Function));
    });
});
