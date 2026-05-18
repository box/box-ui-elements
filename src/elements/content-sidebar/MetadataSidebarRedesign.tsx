/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import flow from 'lodash/flow';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InlineError, LoadingIndicator } from '@box/blueprint-web';
import {
    AutofillContextProvider,
    FilterInstancesDropdown,
    MetadataEmptyState,
    MetadataInstanceList,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplate,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import { TreeQueryInput } from '@box/combobox-with-api';

import type { GetPreviewForMetadataReturnType } from './types/BoxAISidebarTypes';
import API from '../../api';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { useFeatureEnabled } from '../common/feature-checking';
import {
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    SIDEBAR_VIEW_METADATA,
    ERROR_CODE_METADATA_STRUCTURED_TEXT_REP,
} from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import MetadataTemplateDropdown from './MetadataTemplateDropdown';
import { MOCK_ENTERPRISE_ID } from './constants/mockMetadataTemplateNamespaces';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';
import { metadataTaxonomyFetcher, metadataTaxonomyNodeAncestorsFetcher } from './fetchers/metadataTaxonomyFetcher';
import { useMetadataSidebarFilteredTemplates } from './hooks/useMetadataSidebarFilteredTemplates';
import useMetadataFieldSelection from './hooks/useMetadataFieldSelection';
import useMetadataSidebarUnsavedChangesGuard from './hooks/useMetadataSidebarUnsavedChangesGuard';
import useMetadataTemplateEditor from './hooks/useMetadataTemplateEditor';
import useMockCreatedTemplates from './hooks/useMockCreatedTemplates';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface ExternalProps {
    isFeatureEnabled: boolean;
    getStructuredTextRep?: (fileId: string, accessToken: string) => Promise<string>;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileExtension?: string;
    fileId: string;
    filteredTemplateIds?: string[];
    getPreview: () => GetPreviewForMetadataReturnType;
    hasSidebarInitialized?: boolean;
}

export interface ErrorContextProps {
    onError: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
}

export interface SuccessContextProps {
    onSuccess: (code: string, showNotification: boolean) => void;
}

export interface MetadataSidebarRedesignProps
    extends PropsWithoutContext,
        ErrorContextProps,
        SuccessContextProps,
        WithLoggerProps,
        RouteComponentProps {
    api: API;
    createSessionRequest?: (
        payload: Record<string, unknown>,
        fileId: string,
    ) => Promise<{ metadata: { is_large_file: boolean } }>;
    onEditingStateChange?: (isEditing: boolean) => void;
    registerOpenWarningModalCallback?: (handleWarningModalOpen: (isOpen: boolean) => void) => void;
    onWarningModalDiscard?: () => void;
    onWarningModalClose?: () => void;
    trackEvent?: (eventName: string, data?: Record<string, unknown>) => void;
}

function MetadataSidebarRedesign({
    api,
    elementId,
    fileExtension,
    fileId,
    filteredTemplateIds = [],
    getPreview,
    history,
    onError,
    onSuccess,
    isFeatureEnabled,
    createSessionRequest,
    getStructuredTextRep,
    onEditingStateChange,
    registerOpenWarningModalCallback,
    onWarningModalDiscard,
    onWarningModalClose,
    trackEvent,
}: MetadataSidebarRedesignProps) {
    const { formatMessage } = useIntl();
    const isBoxAiSuggestionsEnabled: boolean = useFeatureEnabled('metadata.aiSuggestions.enabled');
    const isBetaLanguageEnabled: boolean = useFeatureEnabled('metadata.betaLanguage.enabled');
    const isMetadataMultiLevelTaxonomyFieldEnabled: boolean = useFeatureEnabled('metadata.multilevelTaxonomy.enabled');
    const isAdvancedExtractAgentEnabled: boolean = useFeatureEnabled('metadata.extractAdvancedAgents.enabled');
    const isDeleteConfirmationModalCheckboxEnabled: boolean = useFeatureEnabled(
        'metadata.deleteConfirmationModalCheckbox.enabled',
    );
    const isConfidenceScoreReviewEnabled: boolean = useFeatureEnabled('metadata.confidenceScore.enabled');
    const isMetadataTemplateManagementEnabled: boolean = useFeatureEnabled('metadata.templateManagement.enabled');

    const {
        clearExtractError,
        extractSuggestions,
        file,
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        handleUpdateMetadataInstance,
        templates,
        extractErrorCode,
        errorMessage,
        status,
        templateInstances,
    } = useSidebarMetadataFetcher(api, fileId, onError, onSuccess, isFeatureEnabled, isConfidenceScoreReviewEnabled);
    const isSessionInitiated = useRef(false);

    const [isLargeFile, setIsLargeFile] = useState<boolean>(false);

    const [editingTemplate, setEditingTemplate] = useState<MetadataTemplateInstance | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState<boolean>(false);
    const [shouldShowOnlyReviewFields, setShouldShowOnlyReviewFields] = useState<boolean>(false);
    // The template dropdown is controlled so the host can dismiss it when the
    // user escalates to the template editor modal or finishes a selection.
    // Fresh data is fetched via `itemsService.getTemplates` on every reopen.
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const { selectedMetadataFieldId, handleSelectMetadataField } = useMetadataFieldSelection(getPreview);
    const [appliedTemplateInstances, setAppliedTemplateInstances] =
        useState<Array<MetadataTemplateInstance | MetadataTemplate>>(templateInstances);
    const [pendingTemplateToEdit, setPendingTemplateToEdit] = useState<MetadataTemplateInstance | null>(null);
    const { handleUnsavedChangesModalOpen, pendingNavLocation, setPendingNavLocation, unblockRouterHistory } =
        useMetadataSidebarUnsavedChangesGuard({
            editingTemplate,
            fileId,
            history,
            isConfidenceScoreReviewEnabled,
            onWarningModalClose,
            onEditingStateChange,
            setEditingTemplate,
            setIsUnsavedChangesModalOpen,
            setPendingTemplateToEdit,
            registerOpenWarningModalCallback,
        });

    const shouldFetchStructuredTextRep =
        isBoxAiSuggestionsEnabled &&
        fileExtension?.toLowerCase() === 'pdf' &&
        api.options?.token &&
        !!getStructuredTextRep;

    // Fetch structured text representation for Box AI
    useEffect(() => {
        if (shouldFetchStructuredTextRep) {
            api.options.token(fileId).then(({ read }) => {
                getStructuredTextRep(fileId, read)
                    .then()
                    .catch(error => {
                        onError(error, ERROR_CODE_METADATA_STRUCTURED_TEXT_REP);
                    });
            });
        }
    }, [
        api.options,
        fileExtension,
        fileId,
        getStructuredTextRep,
        isBoxAiSuggestionsEnabled,
        onError,
        shouldFetchStructuredTextRep,
    ]);

    useEffect(() => {
        // disable only pre-existing template instances from dropdown if not editing or editing pre-exiting one
        const isEditingTemplateAlreadyExisting =
            editingTemplate &&
            templateInstances.some(
                t => t.templateKey === editingTemplate.templateKey && t.scope === editingTemplate.scope,
            );

        if (!editingTemplate || isEditingTemplateAlreadyExisting) {
            setAppliedTemplateInstances(templateInstances);
        } else {
            setAppliedTemplateInstances([...templateInstances, editingTemplate]);
        }
    }, [editingTemplate, templateInstances, templateInstances.length]);

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        clearExtractError();
        setIsDropdownOpen(false);

        if (editingTemplate) {
            setPendingTemplateToEdit(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsUnsavedChangesModalOpen(true);
        } else {
            setEditingTemplate(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsDeleteButtonDisabled(true);
        }
    };

    const handleCancel = () => {
        clearExtractError();
        setEditingTemplate(null);
        setShouldShowOnlyReviewFields(false);
    };

    const handleDiscardUnsavedChanges = () => {
        if (pendingNavLocation && isConfidenceScoreReviewEnabled) {
            unblockRouterHistory();
            setEditingTemplate(null);
            history.push(pendingNavLocation);
            setPendingNavLocation(null);
        } else if (pendingTemplateToEdit) {
            setEditingTemplate(pendingTemplateToEdit);
            setIsDeleteButtonDisabled(true);

            setPendingTemplateToEdit(null);
        } else {
            handleCancel();
        }

        setIsUnsavedChangesModalOpen(false);
        onWarningModalDiscard?.();
    };

    const handleDeleteInstance = async (metadataInstance: MetadataTemplateInstance) => {
        try {
            await handleDeleteMetadataInstance(metadataInstance);
        } catch {
            // ignore error, handled in useSidebarMetadataFetcher
        }
        clearExtractError();
        setEditingTemplate(null);
        setShouldShowOnlyReviewFields(false);
    };

    const isExistingMetadataInstance = (): boolean => {
        return (
            editingTemplate && !!templateInstances.find(templateInstance => templateInstance.id === editingTemplate.id)
        );
    };

    const handleSubmit = async (values: FormValues, operations: JSONPatchOperations) => {
        if (isExistingMetadataInstance()) {
            await handleUpdateMetadataInstance(values.metadata as MetadataTemplateInstance, operations, () =>
                setEditingTemplate(null),
            );
        } else {
            await handleCreateMetadataInstance(values.metadata as MetadataTemplateInstance, () =>
                setEditingTemplate(null),
            );
        }
    };

    const visibleTemplateInstances = templateInstances.filter(templateInstance => !templateInstance.hidden);

    const isSuccess = status === STATUS.SUCCESS;
    const isLoading = status === STATUS.LOADING;

    const isViewMode = !isLoading && file && templates && templateInstances && !editingTemplate;
    const showEmptyState = isViewMode && visibleTemplateInstances.length === 0;
    const showList = isViewMode && visibleTemplateInstances.length > 0;

    const areAiSuggestionsAvailable = isExtensionSupportedForMetadataSuggestions(file?.extension ?? '');

    // Mocked while the real enterprise FQN is not yet plumbed through the
    // metadata API contract; pinned to the same constant the mock namespaces
    // are prefixed with so breadcrumb back-navigation hits the level cache.
    const enterpriseId = MOCK_ENTERPRISE_ID;

    // Hardcoded until the metadata template management permission is exposed
    // on the file/enterprise context — at which point this becomes a real
    // permission read instead of a constant.
    const canCreateAtRoot = true;

    const { browserTemplatesByNamespace, editorTemplatesById, appendCreatedTemplate } = useMockCreatedTemplates();
    const { openCreate: openCreateTemplate, modal: templateEditorModal } = useMetadataTemplateEditor({
        onCreate: appendCreatedTemplate,
    });

    const handleCreateTemplate = useCallback(
        (namespaceFqn: string) => {
            setIsDropdownOpen(false);
            openCreateTemplate(namespaceFqn);
        },
        [openCreateTemplate],
    );

    const metadataDropdown = isSuccess && templates && (
        <MetadataTemplateDropdown
            browserTemplatesByNamespace={browserTemplatesByNamespace}
            canCreateAtRoot={canCreateAtRoot}
            editorTemplatesById={editorTemplatesById}
            enterpriseId={enterpriseId}
            isMetadataTemplateManagementEnabled={isMetadataTemplateManagementEnabled}
            onCreateTemplate={handleCreateTemplate}
            onOpenChange={setIsDropdownOpen}
            onSelect={handleTemplateSelect}
            open={isDropdownOpen}
            selectedTemplates={appliedTemplateInstances as MetadataTemplate[]}
            templates={templates}
        />
    );

    const { handleSetFilteredTemplates, filteredTemplates, templateInstancesList } =
        useMetadataSidebarFilteredTemplates(history, filteredTemplateIds, templateInstances);
    const filterDropdown =
        isSuccess && isViewMode && visibleTemplateInstances.length > 1 ? (
            <FilterInstancesDropdown
                appliedTemplates={visibleTemplateInstances as MetadataTemplate[]}
                selectedTemplates={filteredTemplates}
                setSelectedTemplates={handleSetFilteredTemplates}
            />
        ) : null;

    const errorMessageDisplay = status === STATUS.ERROR && errorMessage && (
        <InlineError className="bcs-MetadataSidebarRedesign-inline-error">
            <FormattedMessage {...errorMessage} />
        </InlineError>
    );

    const taxonomyOptionsFetcher = useCallback(
        (scope: string, templateKey: string, fieldKey: string, level: number, options: TreeQueryInput) =>
            metadataTaxonomyFetcher(api, fileId, scope, templateKey, fieldKey, level, options),
        [api, fileId],
    );

    const taxonomyNodeFetcher = useCallback(
        (scope: string, taxonomyKey: string, nodeID: string) =>
            metadataTaxonomyNodeAncestorsFetcher(api, fileId, scope, taxonomyKey, nodeID),
        [api, fileId],
    );

    useEffect(() => {
        if (createSessionRequest && fileId && !isSessionInitiated.current) {
            isSessionInitiated.current = true;
            createSessionRequest({ items: [{ id: fileId }] }, fileId).then(
                ({ metadata = { is_large_file: false } }) => {
                    setIsLargeFile(metadata.is_large_file);
                },
            );
        }
    }, [createSessionRequest, fileId]);

    return (
        <>
            {templateEditorModal}
            <SidebarContent
                actions={metadataDropdown}
                className={'bcs-MetadataSidebarRedesign'}
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_METADATA}
                title={formatMessage(messages.sidebarMetadataTitle)}
                subheader={filterDropdown}
            >
                <div className="bcs-MetadataSidebarRedesign-content">
                    {errorMessageDisplay}
                    {isLoading && <LoadingIndicator aria-label={formatMessage(messages.loading)} />}
                    {showEmptyState && (
                        <MetadataEmptyState
                            level={'file'}
                            isBoxAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                        />
                    )}
                    <AutofillContextProvider
                        fetchSuggestions={extractSuggestions}
                        isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                    >
                        {editingTemplate && (
                            <MetadataInstanceEditor
                                areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                                errorCode={extractErrorCode}
                                isBetaLanguageEnabled={isBetaLanguageEnabled}
                                isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                                isDeleteButtonDisabled={isDeleteButtonDisabled}
                                isDeleteConfirmationModalCheckboxEnabled={isDeleteConfirmationModalCheckboxEnabled}
                                isLargeFile={isLargeFile}
                                isMetadataMultiLevelTaxonomyFieldEnabled={isMetadataMultiLevelTaxonomyFieldEnabled}
                                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                                onCancel={handleCancel}
                                onDelete={handleDeleteInstance}
                                onDiscardUnsavedChanges={handleDiscardUnsavedChanges}
                                onSubmit={handleSubmit}
                                onToggleReviewFilter={() => setShouldShowOnlyReviewFields(!shouldShowOnlyReviewFields)}
                                setIsUnsavedChangesModalOpen={handleUnsavedChangesModalOpen}
                                shouldShowOnlyReviewFields={shouldShowOnlyReviewFields}
                                taxonomyOptionsFetcher={taxonomyOptionsFetcher}
                                template={editingTemplate}
                                isAdvancedExtractAgentEnabled={isAdvancedExtractAgentEnabled}
                                isConfidenceScoreReviewEnabled={isConfidenceScoreReviewEnabled}
                                onSelectMetadataField={handleSelectMetadataField}
                                selectedMetadataFieldId={selectedMetadataFieldId}
                                trackEvent={trackEvent}
                            />
                        )}
                        {showList && (
                            <MetadataInstanceList
                                areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                                isAdvancedExtractAgentEnabled={isAdvancedExtractAgentEnabled}
                                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                                isBetaLanguageEnabled={isBetaLanguageEnabled}
                                onEdit={(templateInstance, shouldEnableReviewFilter = false) => {
                                    setEditingTemplate(templateInstance);
                                    setIsDeleteButtonDisabled(false);
                                    setShouldShowOnlyReviewFields(shouldEnableReviewFilter);
                                }}
                                onSelectMetadataField={handleSelectMetadataField}
                                selectedMetadataFieldId={selectedMetadataFieldId}
                                templateInstances={templateInstancesList}
                                taxonomyNodeFetcher={taxonomyNodeFetcher}
                                isConfidenceScoreReviewEnabled={isConfidenceScoreReviewEnabled}
                                trackEvent={trackEvent}
                            />
                        )}
                    </AutofillContextProvider>
                </div>
            </SidebarContent>
        </>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withRouter,
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
