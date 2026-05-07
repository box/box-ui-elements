/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import flow from 'lodash/flow';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InlineError, LoadingIndicator } from '@box/blueprint-web';
import {
    AddMetadataTemplateDropdown,
    AutofillContextProvider,
    FilterInstancesDropdown,
    MetadataEmptyState,
    MetadataInstanceList,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplate,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import {
    MetadataTemplateEditorModal,
    MetadataTemplateEditorMode,
    type MetadataTemplateCreateBody,
    type MetadataTemplatePatchItem,
} from '@box/metadata-template-editor';
import { TreeQueryInput } from '@box/combobox-with-api';

import type { GetPreviewForMetadataReturnType } from './types/BoxAISidebarTypes';
import API from '../../api';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { useFeatureEnabled } from '../common/feature-checking';
import {
    ERROR_CODE_METADATA_STRUCTURED_TEXT_REP,
    ERROR_CODE_METADATA_TEMPLATE_DEFINITION_SAVE,
    METADATA_SCOPE_ENTERPRISE,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    SIDEBAR_VIEW_METADATA,
    SUCCESS_CODE_SAVE_METADATA_TEMPLATE_DEFINITION,
} from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';
import { metadataTaxonomyFetcher, metadataTaxonomyNodeAncestorsFetcher } from './fetchers/metadataTaxonomyFetcher';
import { useMetadataSidebarFilteredTemplates } from './hooks/useMetadataSidebarFilteredTemplates';
import useMetadataFieldSelection from './hooks/useMetadataFieldSelection';
import useMetadataSidebarUnsavedChangesGuard from './hooks/useMetadataSidebarUnsavedChangesGuard';
import {
    createAdminMetadataTemplate,
    fetchAdminMetadataTaxonomiesFormatted,
    fetchAdminMetadataTemplateDetails,
    updateAdminMetadataTemplate,
} from '../../utils/adminConsoleMetadataTemplates';

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

    const {
        clearExtractError,
        extractSuggestions,
        file,
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        handleUpdateMetadataInstance,
        refetchMetadata,
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

    const [isTemplateDefinitionCreateModalOpen, setIsTemplateDefinitionCreateModalOpen] = useState(false);
    const [templateDefinitionEditTarget, setTemplateDefinitionEditTarget] = useState<{
        scope: string;
        templateKey: string;
    } | null>(null);
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

    const enterpriseTemplateNamespace = useMemo(
        () => templates?.find(t => t.scope?.startsWith(`${METADATA_SCOPE_ENTERPRISE}_`))?.scope,
        [templates],
    );

    const taxonomyNamespaceForTemplateEditor = enterpriseTemplateNamespace ?? templateDefinitionEditTarget?.scope;

    const fetchTaxonomiesForTemplateEditor = useCallback(async () => {
        if (!taxonomyNamespaceForTemplateEditor) {
            return [];
        }
        return fetchAdminMetadataTaxonomiesFormatted(taxonomyNamespaceForTemplateEditor);
    }, [taxonomyNamespaceForTemplateEditor]);

    const fetchTemplateForDefinitionEdit = useCallback(async () => {
        if (!templateDefinitionEditTarget) {
            throw new Error('No template selected for edit');
        }
        return fetchAdminMetadataTemplateDetails(
            templateDefinitionEditTarget.scope,
            templateDefinitionEditTarget.templateKey,
        );
    }, [templateDefinitionEditTarget]);

    const handleTemplateDefinitionEditSubmit = useCallback(
        async (requestBody: MetadataTemplatePatchItem[]) => {
            if (!templateDefinitionEditTarget) {
                return;
            }
            await updateAdminMetadataTemplate(
                templateDefinitionEditTarget.scope,
                templateDefinitionEditTarget.templateKey,
                requestBody,
            );
            refetchMetadata();
            onSuccess(SUCCESS_CODE_SAVE_METADATA_TEMPLATE_DEFINITION, true);
        },
        [onSuccess, refetchMetadata, templateDefinitionEditTarget],
    );

    const handleTemplateDefinitionCreateSubmit = useCallback(
        async (body: MetadataTemplateCreateBody) => {
            await createAdminMetadataTemplate(
                body,
                (templates ?? []).map(t => t.templateKey),
            );
            refetchMetadata();
            onSuccess(SUCCESS_CODE_SAVE_METADATA_TEMPLATE_DEFINITION, true);
        },
        [onSuccess, refetchMetadata, templates],
    );

    const handleTemplateDefinitionSubmitError = useCallback(
        (error: unknown) => {
            onError(
                error instanceof Error ? error : new Error(String(error)),
                ERROR_CODE_METADATA_TEMPLATE_DEFINITION_SAVE,
            );
        },
        [onError],
    );

    const handleCloseTemplateDefinitionEditModal = useCallback(() => {
        setTemplateDefinitionEditTarget(null);
    }, []);

    const metadataDropdown = isSuccess && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={appliedTemplateInstances as MetadataTemplate[]}
            onSelect={handleTemplateSelect}
            isTemplateManagementEnabled={true}
            onEditTemplate={(identifier: { namespaceFQN: string; templateKey: string }) => {
                setTemplateDefinitionEditTarget({
                    scope: identifier.namespaceFQN,
                    templateKey: identifier.templateKey,
                });
            }}
            onCreateTemplate={() => {
                if (enterpriseTemplateNamespace) {
                    setIsTemplateDefinitionCreateModalOpen(true);
                }
            }}
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
        <SidebarContent
            actions={metadataDropdown}
            className={'bcs-MetadataSidebarRedesign'}
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_METADATA}
            title={formatMessage(messages.sidebarMetadataTitle)}
            subheader={filterDropdown}
        >
            {enterpriseTemplateNamespace && (
                <MetadataTemplateEditorModal
                    mode={MetadataTemplateEditorMode.Create}
                    namespace={enterpriseTemplateNamespace}
                    open={isTemplateDefinitionCreateModalOpen}
                    onOpenChange={setIsTemplateDefinitionCreateModalOpen}
                    onCancel={() => setIsTemplateDefinitionCreateModalOpen(false)}
                    onCreateTemplate={handleTemplateDefinitionCreateSubmit}
                    fetchTaxonomies={fetchTaxonomiesForTemplateEditor}
                    onSubmitError={handleTemplateDefinitionSubmitError}
                />
            )}
            <MetadataTemplateEditorModal
                mode={MetadataTemplateEditorMode.Edit}
                open={Boolean(templateDefinitionEditTarget)}
                onOpenChange={open => {
                    if (!open) {
                        handleCloseTemplateDefinitionEditModal();
                    }
                }}
                onCancel={handleCloseTemplateDefinitionEditModal}
                fetchTemplate={fetchTemplateForDefinitionEdit}
                onEditTemplate={handleTemplateDefinitionEditSubmit}
                fetchTaxonomies={fetchTaxonomiesForTemplateEditor}
                onSubmitError={handleTemplateDefinitionSubmitError}
            />
            <div className="bcs-MetadataSidebarRedesign-content">
                {errorMessageDisplay}
                {isLoading && <LoadingIndicator aria-label={formatMessage(messages.loading)} />}
                {showEmptyState && (
                    <MetadataEmptyState level={'file'} isBoxAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled} />
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
                        />
                    )}
                </AutofillContextProvider>
            </div>
        </SidebarContent>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withRouter,
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
