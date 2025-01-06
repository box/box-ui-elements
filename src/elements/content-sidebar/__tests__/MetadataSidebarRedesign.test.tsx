import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { RouteComponentProps } from 'react-router-dom';
import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { screen, render } from '../../../test-utils/testing-library';
import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';

jest.mock('../hooks/useSidebarMetadataFetcher');
const mockUseSidebarMetadataFetcher = useSidebarMetadataFetcher as jest.MockedFunction<
    typeof useSidebarMetadataFetcher
>;

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesign', () => {
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

    const mockTemplateInstance = {
        canEdit: true,
        id: '123',
        scope: 'global',
        templateKey: 'metadata_template_123',
        hidden: false,
        fields: [],
        type: 'metadata_template',
    } satisfies MetadataTemplateInstance;

    const mockCustomTemplateInstance = {
        canEdit: true,
        hidden: false,
        id: 'metadata_template_42',
        fields: [
            {
                key: 'Another testing key',
                type: 'string',
                value: '42',
                hidden: false,
            },
            {
                key: 'Test key',
                type: 'string',
                value: 'Some test value',
                hidden: false,
            },
        ],
        scope: 'global',
        templateKey: 'properties',
        type: 'properties',
    } satisfies MetadataTemplateInstance;

    const mockVisibleTemplateInstance = {
        displayName: 'Visible Template',
        canEdit: true,
        hidden: false,
        fields: [],
        id: 'visible_template',
        scope: 'global',
        templateKey: 'visibleTemplate',
        type: 'metadata_template',
    } satisfies MetadataTemplateInstance;

    const mockHiddenTemplateInstance = {
        displayName: 'Hidden Template',
        canEdit: true,
        hidden: true,
        fields: [],
        id: 'hidden_template',
        scope: 'global',
        templateKey: 'hiddenTemplate',
        type: 'metadata_template',
    } satisfies MetadataTemplateInstance;

    const mockFile = {
        id: '123',
        permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    };

    const renderComponent = (props = {}, features = {}) => {
        const emptyFilteredTemplateIds = [];
        const routeComponentProps = {} as RouteComponentProps;
        const defaultProps = {
            api: {},
            fileId: 'test-file-id-1',
            elementId: 'element-1',
            filteredTemplateIds: emptyFilteredTemplateIds,
            isFeatureEnabled: true,
            onError: jest.fn(),
            onSuccess: jest.fn(),
            ...routeComponentProps,
        } satisfies MetadataSidebarRedesignProps;

        render(<MetadataSidebarRedesign {...defaultProps} {...props} />, { wrapperProps: { features } });
    };

    beforeEach(() => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templates: mockTemplates,
            templateInstances: [],
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "All templates" combobox trigger button', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockTemplateInstance, mockCustomTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        expect(
            screen.getAllByRole('combobox').find(combobox => combobox.textContent === 'All Templates'),
        ).toBeInTheDocument();
    });

    test('should have accessible "Add template" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Add template' })).toBeInTheDocument();
    });

    test('should have selectable "Custom Metadata" template in dropdown', async () => {
        renderComponent();

        const addTemplateButton = screen.getByRole('button', { name: 'Add template' });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = screen.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        userEvent.click(customMetadataOption);

        // instead of below assertions check if template was added when MetadataInstanceList will be implemented
        await userEvent.click(addTemplateButton);

        expect(customMetadataOption).toHaveAttribute('aria-disabled', 'true');
    });

    test('should have accessible "All templates" combobox trigger button', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockTemplateInstance, mockCustomTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        expect(
            screen.getAllByRole('combobox').find(combobox => combobox.textContent === 'All Templates'),
        ).toBeInTheDocument();
    });

    test('should render metadata sidebar with error', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [],
            templates: [],
            errorMessage: {
                id: 'error',
                defaultMessage: 'error message',
            },
            status: STATUS.ERROR,
            file: mockFile,
        });

        const errorMessage = { id: 'error', defaultMessage: 'error message' };
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByText(errorMessage.defaultMessage)).toBeInTheDocument();
    });

    test('should render metadata sidebar with loading indicator', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [],
            templates: [],
            errorMessage: null,
            status: STATUS.LOADING,
            file: mockFile,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });

    test('should correctly render empty state when AI feature is enabled', () => {
        renderComponent({}, { 'metadata.aiSuggestions.enabled': true });
        expect(screen.getByRole('heading', { level: 2, name: 'Autofill Metadata with Box AI' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Use the power of Box AI to quickly capture document metadata, with ever-increasing accuracy.',
            ),
        ).toBeInTheDocument();
    });

    test('should correctly render empty state when AI feature is disabled', () => {
        renderComponent(
            { isBoxAiSuggestionsEnabled: false },
            { wrapperProps: { features: { 'metadata.aiSuggestions.enabled': false } } },
        );
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
        expect(
            screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'),
        ).toBeInTheDocument();
    });

    test('should render empty state when no visible template instances are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockHiddenTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
        expect(
            screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'),
        ).toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 4, name: 'Hidden Template' })).not.toBeInTheDocument();
    });

    test('should render metadata instance list when templates are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Custom Metadata' })).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
    });

    test('should render filter dropdown when more than one templates are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        const filterDropdown = screen.getByRole('combobox');
        expect(filterDropdown.textContent).toContain('All Templates');
    });

    test.each([
        [[mockVisibleTemplateInstance, mockHiddenTemplateInstance]], // One visible and one hidden template
        [[mockVisibleTemplateInstance]], // One visible template
        [[]], // No templates
        [[mockHiddenTemplateInstance]], // One hidden template
    ])(
        'should not render filter dropdown when only one or none visible template is present',
        (templateInstances: MetadataTemplateInstance[]) => {
            mockUseSidebarMetadataFetcher.mockReturnValue({
                extractSuggestions: jest.fn(),
                handleCreateMetadataInstance: jest.fn(),
                handleDeleteMetadataInstance: jest.fn(),
                handleUpdateMetadataInstance: jest.fn(),
                templateInstances,
                templates: mockTemplates,
                errorMessage: null,
                status: STATUS.SUCCESS,
                file: mockFile,
            });

            renderComponent();

            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        },
    );

    test('should render metadata filterd instance list when fileterd templates are present and matching', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        const filteredTemplateIds = [mockVisibleTemplateInstance.id];

        renderComponent({ filteredTemplateIds });

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 4, name: 'Custom Metadata' })).not.toBeInTheDocument();
    });

    test('should render metadata unfiltered instance list when fileterd templates are present and do not match existing templates', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        const filteredTemplateIds = ['non-existing-template-id'];

        renderComponent({ filteredTemplateIds });

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Custom Metadata' })).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
    });
});
