import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { screen, render } from '../../../test-utils/testing-library';
import { FeatureProvider } from '../../common/feature-checking';
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

    const mockFile = {
        id: '123',
        permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    };

    const renderComponent = (props = {}, features = {}) => {
        const defaultProps = {
            api: {},
            fileId: 'test-file-id-1',
            elementId: 'element-1',
            isFeatureEnabled: true,
            onError: jest.fn(),
        } satisfies MetadataSidebarRedesignProps;

        render(
            <FeatureProvider features={features}>
                <MetadataSidebarRedesign {...defaultProps} {...props} />
            </FeatureProvider>,
        );
    };

    beforeEach(() => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            handleDeleteMetadataInstance: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
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

    test('should render metadata sidebar with error', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            handleDeleteMetadataInstance: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
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
        renderComponent({ isBoxAiSuggestionsEnabled: false });
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
        expect(
            screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'),
        ).toBeInTheDocument();
    });

    test('should render metadata instance list when templates are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            handleDeleteMetadataInstance: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1, name: 'Custom Metadata' })).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeInTheDocument();
    });
});
