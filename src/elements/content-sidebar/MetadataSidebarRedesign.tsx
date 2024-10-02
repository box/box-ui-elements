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
    MetadataEmptyState,
    MetadataInstanceList,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateInstance,
    type MetadataTemplate,
} from '@box/metadata-editor';
import noop from 'lodash/noop';

import API from '../../api';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_METADATA_SIDEBAR_REDESIGN, SIDEBAR_VIEW_METADATA } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type ElementsXhrError } from '../../common/types/api';
import { type ElementOrigin } from '../common/flowTypes';
import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface ExternalProps {
    isBoxAiSuggestionsEnabled: boolean;
    isFeatureEnabled: boolean;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

interface ContextInfo {
    isErrorDisplayed: boolean;
    error: ElementsXhrError | Error;
}

export interface ErrorContextProps {
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: ContextInfo, origin?: ElementOrigin) => void;
}

export interface MetadataSidebarRedesignProps extends PropsWithoutContext, ErrorContextProps, WithLoggerProps {
    api: API;
}

function MetadataSidebarRedesign({
    api,
    elementId,
    fileId,
    isBoxAiSuggestionsEnabled,
    onError,
    isFeatureEnabled,
}: MetadataSidebarRedesignProps) {
    const {
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

    const [editingTemplate, setEditingTemplate] = React.useState<MetadataTemplateInstance | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = React.useState<boolean>(false);
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = React.useState<boolean>(false);
    const [selectedTemplates, setSelectedTemplates] =
        React.useState<Array<MetadataTemplateInstance | MetadataTemplate>>(templateInstances);
    const [pendingTemplateToEdit, setPendingTemplateToEdit] = React.useState<MetadataTemplateInstance | null>(null);

    React.useEffect(() => {
        setSelectedTemplates(templateInstances);
    }, [templateInstances]);

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        if (editingTemplate) {
            setPendingTemplateToEdit(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsUnsavedChangesModalOpen(true);
        } else {
            setSelectedTemplates([...selectedTemplates, selectedTemplate]);
            setEditingTemplate(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsDeleteButtonDisabled(true);
        }
    };

    const handleCancel = () => {
        setEditingTemplate(null);
        setSelectedTemplates(templateInstances);
    };

    const handleCancelUnsavedChanges = () => {
        // check if user tried to edit another template before unsaved changes modal
        if (pendingTemplateToEdit) {
            setEditingTemplate(pendingTemplateToEdit);
            setSelectedTemplates([...templateInstances, pendingTemplateToEdit]);
            setIsDeleteButtonDisabled(true);

            setPendingTemplateToEdit(null);
            setIsUnsavedChangesModalOpen(false);
        } else {
            handleCancel();
        }
    };

    const handleDeleteInstance = (metadataInstance: MetadataTemplateInstance) => {
        handleDeleteMetadataInstance(metadataInstance);
        setEditingTemplate(null);
    };

    const isExistingMetadataInstance = (): boolean => {
        return (
            editingTemplate && !!templateInstances.find(templateInstance => templateInstance.id === editingTemplate.id)
        );
    };

    const handleSubmit = async (values: FormValues, operations: JSONPatchOperations) => {
        isExistingMetadataInstance()
            ? handleUpdateMetadataInstance(values.metadata as MetadataTemplateInstance, operations, () =>
                  setEditingTemplate(null),
              )
            : handleCreateMetadataInstance(values.metadata as MetadataTemplateInstance, () => setEditingTemplate(null));
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
                {editingTemplate && (
                    <MetadataInstanceEditor
                        areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                        isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                        isDeleteButtonDisabled={isDeleteButtonDisabled}
                        isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                        onCancel={handleCancel}
                        onDelete={handleDeleteInstance}
                        onDiscardUnsavedChanges={handleCancelUnsavedChanges}
                        onSubmit={handleSubmit}
                        setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                        template={editingTemplate}
                    />
                )}
                {showList && (
                    <MetadataInstanceList
                        isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                        onEdit={templateInstance => {
                            setEditingTemplate(templateInstance);
                            setIsDeleteButtonDisabled(false);
                        }}
                        onEditWithAutofill={noop}
                        templateInstances={templateInstances}
                    />
                )}
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
