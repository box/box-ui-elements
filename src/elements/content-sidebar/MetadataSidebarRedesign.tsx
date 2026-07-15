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
    type MetadataTemplateApiResponse,
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
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    SIDEBAR_VIEW_METADATA,
    ERROR_CODE_METADATA_STRUCTURED_TEXT_REP,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_MODE_SCOPED,
} from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import MetadataTemplateDropdown from './MetadataTemplateDropdown';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';
import {
    createTaxonomyItemsService,
    metadataTaxonomyFetcher,
    metadataTaxonomyNodeAncestorsFetcher,
    type TaxonomyFieldConfig,
} from './fetchers/metadataTaxonomyFetcher';
import { useMetadataSidebarFilteredTemplates } from './hooks/useMetadataSidebarFilteredTemplates';
import useMetadataFieldSelection from './hooks/useMetadataFieldSelection';
import useMetadataSidebarUnsavedChangesGuard from './hooks/useMetadataSidebarUnsavedChangesGuard';
import useMetadataTemplateEditor from './hooks/useMetadataTemplateEditor';
import useMetadataTemplateItemsService from './hooks/useMetadataTemplateItemsService';
import useMetadataNamespaceMode from './hooks/useMetadataNamespaceMode';

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
    const isMetadataTaxonomyPickerEnabled: boolean = useFeatureEnabled('metadata.taxonomyPicker.enabled');
    const isAdvancedExtractAgentEnabled: boolean = useFeatureEnabled('metadata.extractAdvancedAgents.enabled');
    const isDeleteConfirmationModalCheckboxEnabled: boolean = useFeatureEnabled(
        'metadata.deleteConfirmationModalCheckbox.enabled',
    );

    const isConfidenceScoreReviewEnabled: boolean = useFeatureEnabled('metadata.confidenceScore.enabled');
    const isBoundingBoxEnabled = useFeatureEnabled('metadata.boundingBox.enabled');

    const isBoundingBoxOrConfidenceScoreReviewEnabled = isBoundingBoxEnabled || isConfidenceScoreReviewEnabled;

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
    } = useSidebarMetadataFetcher(
        api,
        fileId,
        onError,
        onSuccess,
        isFeatureEnabled,
        isConfidenceScoreReviewEnabled,
        isBoundingBoxEnabled,
    );
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

    // Template management — gated behind namespace migration mode (MIGRATION or FINAL).
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean | undefined>(undefined);

    // Real enterprise FQN (e.g. "enterprise_123456") derived from the already-loaded templates.
    // The numeric ID (without the "enterprise_" prefix) is used for the enterprise configurations API.
    const enterpriseId = templates.find(t => t.scope?.startsWith(`${METADATA_SCOPE_ENTERPRISE}_`))?.scope;
    const enterpriseNumericId = enterpriseId?.slice(METADATA_SCOPE_ENTERPRISE.length + 1);

    // Fetch the migration mode from the enterprise configurations API.
    // Gated behind the enterprise_metadata_namespaces_opt_in split treatment — when the
    // flag is off the hook skips the API call and returns null (= legacy SCOPED behaviour).
    const isNamespacesOptInEnabled: boolean = useFeatureEnabled('metadata.namespacesOptIn.enabled');
    const { mode: metadataNamespaceMode } = useMetadataNamespaceMode(
        file,
        api,
        enterpriseNumericId,
        isNamespacesOptInEnabled,
    );
    const isTemplateManagementEnabled = !!metadataNamespaceMode && metadataNamespaceMode !== METADATA_SCOPE_MODE_SCOPED;

    // API-backed ItemsService for MetadataTemplateBrowser — only active when template management is enabled.
    const itemsService = useMetadataTemplateItemsService(
        api,
        file,
        isTemplateManagementEnabled ? enterpriseId : undefined,
        templates ?? [],
    );

    const { handleUnsavedChangesModalOpen, pendingNavLocation, setPendingNavLocation, unblockRouterHistory } =
        useMetadataSidebarUnsavedChangesGuard({
            editingTemplate,
            fileId,
            history,
            isBoundingBoxOrConfidenceScoreReviewEnabled,
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

    const handleCreateTemplate = useCallback(
        (body: MetadataTemplateCreateBody) =>
            new Promise<void>((resolve, reject) => {
                api.getMetadataAPI(false).createMetadataTemplate(
                    file,
                    body,
                    () => {
                        refetchMetadata();
                        resolve();
                    },
                    (error: Error, code: string) => {
                        onError(error, code);
                        reject(error);
                    },
                );
            }),
        [api, file, onError, refetchMetadata],
    );
    const handleEditTemplate = useCallback(
        (patchItems: MetadataTemplatePatchItem[], identifier: { namespaceFQN: string; templateKey: string }) =>
            new Promise<void>((resolve, reject) => {
                api.getMetadataAPI(false).updateMetadataTemplate(
                    file,
                    identifier.namespaceFQN,
                    identifier.templateKey,
                    patchItems,
                    () => {
                        refetchMetadata();
                        resolve();
                    },
                    (error: Error, code: string) => {
                        onError(error, code);
                        reject(error);
                    },
                );
            }),
        [api, file, onError, refetchMetadata],
    );

    const {
        openCreate,
        openEdit,
        modal: templateEditorModal,
    } = useMetadataTemplateEditor({
        onCreate: handleCreateTemplate,
        onEdit: handleEditTemplate,
    });

    // Opens the template editor in create mode — also dismisses the dropdown popover.
    const handleOpenCreateEditor = useCallback(
        (namespaceFqn: string) => {
            setIsDropdownOpen(false);
            openCreate(namespaceFqn);
        },
        [openCreate],
    );

    // Opens the template editor in edit mode — also dismisses the dropdown popover.
    const handleOpenEditEditor = useCallback(
        ({ namespaceFqn, templateKey }: { namespaceFqn: string; templateKey: string }) => {
            setIsDropdownOpen(false);
            openEdit({
                namespaceFqn,
                templateKey,
                fetchTemplate: () =>
                    api
                        .getMetadataAPI(false)
                        .getTemplateSchemaForEditor(namespaceFqn, templateKey) as Promise<MetadataTemplateApiResponse>,
            });
        },
        [openEdit, api],
    );

    const handleCancel = () => {
        clearExtractError();
        setEditingTemplate(null);
        setShouldShowOnlyReviewFields(false);
    };

    const handleDiscardUnsavedChanges = () => {
        if (pendingNavLocation && isBoundingBoxOrConfidenceScoreReviewEnabled) {
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

    const canEdit = !!file?.permissions?.can_upload;

    const metadataDropdown = canEdit && isSuccess && templates && (
        <MetadataTemplateDropdown
            templates={templates}
            selectedTemplates={appliedTemplateInstances as MetadataTemplate[]}
            onSelect={handleTemplateSelect}
            isMetadataTemplateManagementEnabled={isTemplateManagementEnabled}
            enterpriseId={isTemplateManagementEnabled ? enterpriseId : undefined}
            itemsService={isTemplateManagementEnabled ? itemsService : undefined}
            onCreateTemplate={isTemplateManagementEnabled ? handleOpenCreateEditor : undefined}
            onEditTemplate={isTemplateManagementEnabled ? handleOpenEditEditor : undefined}
            canCreateAtRoot
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
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

    const resolveTaxonomyFieldConfig = useCallback(
        (_templateKey: string, fieldKey: string): TaxonomyFieldConfig | undefined => {
            const field = editingTemplate?.fields?.find(f => f.key === fieldKey && f.type === 'taxonomy');
            if (!field) {
                return undefined;
            }
            return {
                levels: field.levels,
                selectableLevels: field.optionsRules?.selectableLevels,
            };
        },
        [editingTemplate],
    );

    const taxonomyItemsServiceCreator = useMemo(
        () => createTaxonomyItemsService(api, fileId, resolveTaxonomyFieldConfig),
        [api, fileId, resolveTaxonomyFieldConfig],
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
                                createTaxonomyItemsService={
                                    isMetadataTaxonomyPickerEnabled ? taxonomyItemsServiceCreator : undefined
                                }
                                errorCode={extractErrorCode}
                                isBetaLanguageEnabled={isBetaLanguageEnabled}
                                isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                                isDeleteButtonDisabled={isDeleteButtonDisabled}
                                isDeleteConfirmationModalCheckboxEnabled={isDeleteConfirmationModalCheckboxEnabled}
                                isLargeFile={isLargeFile}
                                isMetadataMultiLevelTaxonomyFieldEnabled={isMetadataMultiLevelTaxonomyFieldEnabled}
                                isMetadataTaxonomyPickerEnabled={isMetadataTaxonomyPickerEnabled}
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
                                isBoundingBoxEnabled={isBoundingBoxEnabled}
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
