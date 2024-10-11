/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage, useIntl } from 'react-intl';
import { InlineError, LoadingIndicator } from '@box/blueprint-web';
import {
    AddMetadataTemplateDropdown,
    AutofillContextProvider,
    MetadataEmptyState,
    MetadataInstanceList,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplate,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';

import API from '../../api';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { useFeatureEnabled } from '../common/feature-checking';
import { ORIGIN_METADATA_SIDEBAR_REDESIGN, SIDEBAR_VIEW_METADATA } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface ExternalProps {
    isFeatureEnabled: boolean;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

export interface ErrorContextProps {
    onError: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
}

export interface MetadataSidebarRedesignProps extends PropsWithoutContext, ErrorContextProps, WithLoggerProps {
    api: API;
}

function MetadataSidebarRedesign({ api, elementId, fileId, onError, isFeatureEnabled }: MetadataSidebarRedesignProps) {
    const {
        extractSuggestions,
        file,
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        handleUpdateMetadataInstance,
        templates,
        errorMessage,
        status,
        templateInstances,
    } = useSidebarMetadataFetcher(api, fileId, onError, isFeatureEnabled);

    const { formatMessage } = useIntl();
    const isBoxAiSuggestionsEnabled: boolean = useFeatureEnabled('metadata.aiSuggestions.enabled');

    const [editingTemplate, setEditingTemplate] = React.useState<MetadataTemplateInstance | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = React.useState<boolean>(false);
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = React.useState<boolean>(false);
    const [selectedTemplates, setSelectedTemplates] =
        React.useState<Array<MetadataTemplateInstance | MetadataTemplate>>(templateInstances);
    const [pendingTemplateToEdit, setPendingTemplateToEdit] = React.useState<MetadataTemplateInstance | null>(null);

    React.useEffect(() => {
        // disable only pre-existing template instances from dropdown if not editing or editing pre-exiting one
        const isEditingTemplateAlreadyExisting =
            editingTemplate &&
            templateInstances.some(
                t => t.templateKey === editingTemplate.templateKey && t.scope === editingTemplate.scope,
            );

        if (!editingTemplate || isEditingTemplateAlreadyExisting) {
            setSelectedTemplates(templateInstances);
        } else {
            setSelectedTemplates([...templateInstances, editingTemplate]);
        }
    }, [editingTemplate, templateInstances, templateInstances.length]);

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        if (editingTemplate) {
            setPendingTemplateToEdit(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsUnsavedChangesModalOpen(true);
        } else {
            setEditingTemplate(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsDeleteButtonDisabled(true);
        }
    };

    const handleCancel = () => {
        setEditingTemplate(null);
    };

    const handleDiscardUnsavedChanges = () => {
        // check if user tried to edit another template before unsaved changes modal
        if (pendingTemplateToEdit) {
            setEditingTemplate(pendingTemplateToEdit);
            setIsDeleteButtonDisabled(true);

            setPendingTemplateToEdit(null);
        } else {
            handleCancel();
        }

        setIsUnsavedChangesModalOpen(false);
    };

    const handleDeleteInstance = async (metadataInstance: MetadataTemplateInstance) => {
        await handleDeleteMetadataInstance(metadataInstance);
        setEditingTemplate(null);
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

    const metadataDropdown = status === STATUS.SUCCESS && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={selectedTemplates as MetadataTemplate[]}
            onSelect={handleTemplateSelect}
        />
    );

    const errorMessageDisplay = status === STATUS.ERROR && errorMessage && (
        <InlineError>
            <FormattedMessage {...errorMessage} />
        </InlineError>
    );

    const showTemplateInstances = file && templates && templateInstances;

    const showLoading = status === STATUS.LOADING;
    const showEmptyState = !showLoading && showTemplateInstances && templateInstances.length === 0 && !editingTemplate;
    const showEditor = !showEmptyState && editingTemplate;
    const showList = !showEditor && templateInstances.length > 0 && !editingTemplate;
    const areAiSuggestionsAvailable = isExtensionSupportedForMetadataSuggestions(file?.extension ?? '');

    return (
        <SidebarContent
            actions={metadataDropdown}
            className={'bcs-MetadataSidebarRedesign'}
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_METADATA}
            title={formatMessage(messages.sidebarMetadataTitle)}
        >
            <div className="bcs-MetadataSidebarRedesign-content">
                {errorMessageDisplay}
                {showLoading && <LoadingIndicator aria-label={formatMessage(messages.loading)} />}
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
                            isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                            isDeleteButtonDisabled={isDeleteButtonDisabled}
                            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                            onCancel={handleCancel}
                            onDelete={handleDeleteInstance}
                            onDiscardUnsavedChanges={handleDiscardUnsavedChanges}
                            onSubmit={handleSubmit}
                            setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                            template={editingTemplate}
                        />
                    )}
                    {showList && (
                        <MetadataInstanceList
                            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                            onEdit={templateInstance => {
                                setEditingTemplate(templateInstance);
                                setIsDeleteButtonDisabled(false);
                            }}
                            templateInstances={templateInstances}
                        />
                    )}
                </AutofillContextProvider>
            </div>
        </SidebarContent>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
