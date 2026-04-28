import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { RouteComponentProps } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { FIELD_PERMISSIONS_CAN_UPLOAD, ERROR_CODE_METADATA_STRUCTURED_TEXT_REP } from '../../../constants';
import { screen, render, waitFor, within } from '../../../test-utils/testing-library';
import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';
import useMetadataFieldSelection from '../hooks/useMetadataFieldSelection';

jest.mock('../hooks/useSidebarMetadataFetcher');
const mockUseSidebarMetadataFetcher = useSidebarMetadataFetcher as jest.MockedFunction<
    typeof useSidebarMetadataFetcher
>;

jest.mock('../hooks/useMetadataFieldSelection');
const mockUseMetadataFieldSelection = useMetadataFieldSelection as jest.MockedFunction<
    typeof useMetadataFieldSelection
>;

const getStructuredTextRep = jest.fn().mockResolvedValue('structured-text-rep');
const api = {
    options: {
        token: jest.fn().mockResolvedValue({
            read: 'read-token-value',
            write: 'write-token-value',
        }),
    },
};

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
        const mockHistory = createMemoryHistory({ initialEntries: ['/metadata'] });
        jest.spyOn(mockHistory, 'block');
        jest.spyOn(mockHistory, 'push');
        jest.spyOn(mockHistory, 'replace');

        const routeComponentProps = {
            history: mockHistory,
            location: mockHistory.location,
            match: { params: {}, isExact: true, path: '/metadata', url: '/metadata' },
        } as unknown as RouteComponentProps;

        const defaultProps = {
            api,
            fileExtension: 'pdf',
            getStructuredTextRep,
            getPreview: jest.fn().mockReturnValue({}),
            fileId: 'test-file-id-1',
            elementId: 'element-1',
            filteredTemplateIds: [],
            isFeatureEnabled: true,
            onError: jest.fn(),
            onSuccess: jest.fn(),
            ...routeComponentProps,
        } satisfies MetadataSidebarRedesignProps;

        const renderResult = render(<MetadataSidebarRedesign {...defaultProps} {...props} />, {
            wrapperProps: { features },
        });

        return { mockHistory, ...renderResult };
    };

    beforeEach(() => {
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
            templates: mockTemplates,
            templateInstances: [],
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "All templates" combobox trigger button', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockTemplateInstance, mockCustomTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
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
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockTemplateInstance, mockCustomTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });

        renderComponent();

        expect(
            screen.getAllByRole('combobox').find(combobox => combobox.textContent === 'All Templates'),
        ).toBeInTheDocument();
    });

    test('should render metadata sidebar with error', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
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
            extractErrorCode: null,
        });

        const errorMessage = { id: 'error', defaultMessage: 'error message' };
        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByText(errorMessage.defaultMessage)).toBeInTheDocument();
    });

    test('should render metadata sidebar with loading indicator', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [],
            templates: [],
            errorMessage: null,
            status: STATUS.LOADING,
            file: mockFile,
            extractErrorCode: null,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });

    test('should correctly render empty state when AI feature is enabled', () => {
        renderComponent({}, { 'metadata.aiSuggestions.enabled': true });
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
        expect(
            screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'),
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

    test.each([true, false])('should render with confidence score feature %s', isFFEnabled => {
        renderComponent({}, { 'metadata.confidenceScore.enabled': isFFEnabled });
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
    });

    test('should render empty state when no visible template instances are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockHiddenTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
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
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Custom Metadata' })).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
    });

    test('should call handleDeleteMetadataInstance when delete button is clicked', async () => {
        const handleDeleteMetadataInstance = jest.fn();
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance,
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });

        renderComponent({}, { 'metadata.deleteConfirmationModalCheckbox.enabled': true });

        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeVisible();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await userEvent.click(screen.getByText('Confirm deletion of Metadata instance'));
        const dialog = screen.getByRole('dialog');
        await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

        expect(handleDeleteMetadataInstance).toHaveBeenCalledWith(mockCustomTemplateInstance);
    });

    test('should render filter dropdown when more than one templates are present', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
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
                clearExtractError: jest.fn(),
                extractSuggestions: jest.fn(),
                handleCreateMetadataInstance: jest.fn(),
                handleDeleteMetadataInstance: jest.fn(),
                handleUpdateMetadataInstance: jest.fn(),
                templateInstances,
                templates: mockTemplates,
                errorMessage: null,
                status: STATUS.SUCCESS,
                file: mockFile,
                extractErrorCode: null,
            });

            renderComponent();

            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        },
    );

    test('should render metadata filterd instance list when fileterd templates are present and matching', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });

        const filteredTemplateIds = [mockVisibleTemplateInstance.id];

        renderComponent({ filteredTemplateIds });

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 4, name: 'Custom Metadata' })).not.toBeInTheDocument();
    });

    test('should render metadata unfiltered instance list when fileterd templates are present and do not match existing templates', () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            clearExtractError: jest.fn(),
            extractSuggestions: jest.fn(),
            handleCreateMetadataInstance: jest.fn(),
            handleDeleteMetadataInstance: jest.fn(),
            handleUpdateMetadataInstance: jest.fn(),
            templateInstances: [mockCustomTemplateInstance, mockVisibleTemplateInstance],
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
            extractErrorCode: null,
        });

        const filteredTemplateIds = ['non-existing-template-id'];

        renderComponent({ filteredTemplateIds });

        expect(screen.getByRole('heading', { level: 2, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'Custom Metadata' })).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[0].key)).toBeInTheDocument();
        expect(screen.getByText(mockCustomTemplateInstance.fields[1].key)).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 4, name: 'Visible Template' })).toBeInTheDocument();
    });

    test('should call getStructuredTextRep', async () => {
        renderComponent({ api }, { 'metadata.aiSuggestions.enabled': true });

        await waitFor(() => expect(getStructuredTextRep).toHaveBeenCalledTimes(1));
    });

    test.each`
        description                                                            | isFeatureEnabled | fileExtension
        ${'isBoxAiSuggestionsEnabled is false'}                                | ${false}         | ${'pdf'}
        ${'fileExtension is not a pdf'}                                        | ${true}          | ${'docx'}
        ${'isBoxAiSuggestionsEnabled is false and fileExtension is not a pdf'} | ${false}         | ${'docx'}
    `('should not call getStructuredTextRep when $description', async ({ isFeatureEnabled, fileExtension }) => {
        renderComponent({ api, fileExtension }, { 'metadata.aiSuggestions.enabled': isFeatureEnabled });

        await waitFor(() => expect(getStructuredTextRep).not.toHaveBeenCalled());
    });

    test('should call onError when getStructuredTextRep fails', async () => {
        const getStructuredTextRepError = jest.fn().mockRejectedValue(new Error('Failed to fetch structured text'));
        const onError = jest.fn();

        renderComponent(
            { getStructuredTextRep: getStructuredTextRepError, api, onError },
            { 'metadata.aiSuggestions.enabled': true },
        );

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), ERROR_CODE_METADATA_STRUCTURED_TEXT_REP);
        });
    });

    test('should pass isConfidenceScoreReviewEnabled to useSidebarMetadataFetcher', () => {
        renderComponent({}, { 'metadata.confidenceScore.enabled': true });

        expect(mockUseSidebarMetadataFetcher).toHaveBeenCalledWith(
            expect.anything(), // api
            expect.anything(), // fileId
            expect.anything(), // onError
            expect.anything(), // onSuccess
            expect.anything(), // isFeatureEnabled
            true, // isConfidenceScoreReviewEnabled
        );
    });

    test('should pass isConfidenceScoreReviewEnabled=false when feature flag is off', () => {
        renderComponent({}, { 'metadata.confidenceScore.enabled': false });

        expect(mockUseSidebarMetadataFetcher).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            false,
        );
    });

    test('should call createSessionRequest once', async () => {
        const createSessionRequest = jest.fn().mockResolvedValue({});
        renderComponent({ api, createSessionRequest }, { 'metadata.aiSuggestions.enabled': true });

        expect(createSessionRequest).toHaveBeenCalledTimes(1);
        expect(createSessionRequest).toHaveBeenCalledWith({ items: [{ id: 'test-file-id-1' }] }, 'test-file-id-1');
    });

    test('should not call createSessionRequest once when fileId is not provided', async () => {
        const createSessionRequest = jest.fn().mockResolvedValue({});
        renderComponent({ api, createSessionRequest, fileId: undefined }, { 'metadata.aiSuggestions.enabled': true });

        expect(createSessionRequest).not.toHaveBeenCalledTimes(1);
        expect(createSessionRequest).not.toHaveBeenCalledWith({ items: [{ id: undefined }] }, undefined);
    });

    test('should pass getPreview to useMetadataFieldSelection', () => {
        const getPreview = jest.fn();
        renderComponent({ getPreview });

        expect(mockUseMetadataFieldSelection).toHaveBeenCalledWith(getPreview);
    });

    describe('navigation blocking', () => {
        const navBlockFeatures = { 'metadata.confidenceScore.enabled': true };

        const setupWithEditableTemplates = () => {
            mockUseSidebarMetadataFetcher.mockReturnValue({
                clearExtractError: jest.fn(),
                extractSuggestions: jest.fn(),
                handleCreateMetadataInstance: jest.fn(),
                handleDeleteMetadataInstance: jest.fn(),
                handleUpdateMetadataInstance: jest.fn(),
                templateInstances: [mockVisibleTemplateInstance],
                templates: mockTemplates,
                errorMessage: null,
                status: STATUS.SUCCESS,
                file: mockFile,
                extractErrorCode: null,
            });
        };

        const startEditing = async (mockHistory: ReturnType<typeof createMemoryHistory>) => {
            const editButton = screen.getByRole('button', { name: 'Edit Visible Template' });
            await userEvent.click(editButton);
            return mockHistory.block as jest.Mock;
        };

        const triggerBlockCallback = (blockSpy: jest.Mock) => {
            const blockCallback = blockSpy.mock.calls[0][0];
            const fakeLocation = { pathname: '/boxai', search: '', hash: '', state: undefined };
            blockCallback(fakeLocation);
        };

        test('should install history.block when editing and feature flag is on', async () => {
            setupWithEditableTemplates();
            const { mockHistory } = renderComponent({}, navBlockFeatures);

            expect(mockHistory.block).not.toHaveBeenCalled();

            await startEditing(mockHistory);

            expect(mockHistory.block).toHaveBeenCalledTimes(1);
            expect(mockHistory.block).toHaveBeenCalledWith(expect.any(Function));
        });

        test('should not install history.block when feature flag is off', async () => {
            setupWithEditableTemplates();
            const { mockHistory } = renderComponent({}, { 'metadata.confidenceScore.enabled': false });

            await startEditing(mockHistory);

            expect(mockHistory.block).not.toHaveBeenCalled();
        });

        test('should show unsaved changes modal when navigation is attempted while editing', async () => {
            setupWithEditableTemplates();
            const { mockHistory } = renderComponent({}, navBlockFeatures);

            const blockSpy = await startEditing(mockHistory);
            triggerBlockCallback(blockSpy);

            expect(await screen.findByText('Unsaved Changes')).toBeInTheDocument();
        });

        test('should navigate to pending location on discard', async () => {
            setupWithEditableTemplates();
            const { mockHistory } = renderComponent({}, navBlockFeatures);

            const blockSpy = await startEditing(mockHistory);
            triggerBlockCallback(blockSpy);

            const discardButton = await screen.findByRole('button', { name: 'Discard Changes' });
            await userEvent.click(discardButton);

            expect(mockHistory.push).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/boxai' }));
            expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
        });

        test('should re-sync URL to metadata on continue editing', async () => {
            setupWithEditableTemplates();
            const { mockHistory } = renderComponent({}, navBlockFeatures);

            const blockSpy = await startEditing(mockHistory);
            triggerBlockCallback(blockSpy);

            const continueButton = await screen.findByRole('button', { name: 'Continue Editing' });
            await userEvent.click(continueButton);

            expect(mockHistory.replace).toHaveBeenCalledWith('/metadata');
            expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
        });

        test('should remove history.block on unmount', async () => {
            setupWithEditableTemplates();
            const mockUnblock = jest.fn();
            const { mockHistory, unmount } = renderComponent({}, navBlockFeatures);

            (mockHistory.block as jest.Mock).mockReturnValue(mockUnblock);

            await startEditing(mockHistory);

            unmount();

            expect(mockUnblock).toHaveBeenCalled();
        });

        test('should call registerOpenWarningModalCallback with modal open fn on mount', () => {
            setupWithEditableTemplates();
            const registerOpenWarningModalCallback = jest.fn();

            renderComponent({ registerOpenWarningModalCallback }, navBlockFeatures);

            expect(registerOpenWarningModalCallback).toHaveBeenCalledWith(expect.any(Function));
        });

        test('should call onWarningModalDiscard when discard is clicked', async () => {
            setupWithEditableTemplates();
            const onWarningModalDiscard = jest.fn();
            const { mockHistory } = renderComponent({ onWarningModalDiscard }, navBlockFeatures);

            const blockSpy = await startEditing(mockHistory);
            triggerBlockCallback(blockSpy);

            const discardButton = await screen.findByRole('button', { name: 'Discard Changes' });
            await userEvent.click(discardButton);

            expect(onWarningModalDiscard).toHaveBeenCalledTimes(1);
        });

        test('should call onWarningModalClose when parent-driven modal closes with no pending location', () => {
            setupWithEditableTemplates();
            const onWarningModalClose = jest.fn();
            let capturedCallback: ((isOpen: boolean) => void) | undefined;
            const registerOpenWarningModalCallback = jest.fn(fn => {
                capturedCallback = fn;
            });

            renderComponent({ onWarningModalClose, registerOpenWarningModalCallback }, navBlockFeatures);

            expect(capturedCallback).toBeDefined();
            capturedCallback!(true);
            capturedCallback!(false);

            expect(onWarningModalClose).toHaveBeenCalledTimes(1);
        });

        test('should call onWarningModalClose when closing modal after a router-blocked nav', async () => {
            setupWithEditableTemplates();
            const onWarningModalClose = jest.fn();
            const { mockHistory } = renderComponent({ onWarningModalClose }, navBlockFeatures);

            const blockSpy = await startEditing(mockHistory);
            triggerBlockCallback(blockSpy);

            const continueButton = await screen.findByRole('button', { name: 'Continue Editing' });
            await userEvent.click(continueButton);

            expect(mockHistory.replace).toHaveBeenCalledWith('/metadata');
            expect(onWarningModalClose).toHaveBeenCalledTimes(1);
        });

        test('should NOT call onWarningModalClose when feature flag is disabled', () => {
            setupWithEditableTemplates();
            const onWarningModalClose = jest.fn();
            let capturedCallback: ((isOpen: boolean) => void) | undefined;
            const registerOpenWarningModalCallback = jest.fn(fn => {
                capturedCallback = fn;
            });

            renderComponent(
                { onWarningModalClose, registerOpenWarningModalCallback },
                { 'metadata.confidenceScore.enabled': false },
            );

            expect(capturedCallback).toBeDefined();
            capturedCallback!(false);

            expect(onWarningModalClose).not.toHaveBeenCalled();
        });
    });
});
