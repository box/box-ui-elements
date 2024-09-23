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
    type MetadataTemplateInstance,
    type MetadataTemplate,
} from '@box/metadata-editor';
import noop from 'lodash/noop';

import { FormValues } from '@box/metadata-editor/types/lib/components/metadata-instance-editor/types';
import uniqueId from 'lodash/uniqueId';
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
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        file,
        templates,
        errorMessage,
        status,
        templateInstances,
        updateMetadataInstance,
    } = useSidebarMetadataFetcher(api, fileId, onError, isFeatureEnabled);

    const { formatMessage } = useIntl();

    const [editingTemplate, setEditingTemplate] = React.useState<MetadataTemplateInstance | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = React.useState<boolean>(false);

    const [selectedTemplates, setSelectedTemplates] =
        React.useState<Array<MetadataTemplateInstance | MetadataTemplate>>(templateInstances);

    React.useEffect(() => {
        setSelectedTemplates(templateInstances);
    }, [templateInstances]);

    const handleUnsavedChanges = () => {
        setIsUnsavedChangesModalOpen(true);
    };

    const convertToInstance = (template: MetadataTemplate): MetadataTemplateInstance => {
        return {
            canEdit: !!file.permissions.can_upload,
            displayName: template.displayName,
            hidden: template.hidden,
            id: uniqueId('metadata_template_'),
            fields: template.fields,
            scope: template.scope,
            templateKey: template.templateKey,
            type: template.type,
        };
    };

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        setSelectedTemplates([...selectedTemplates, selectedTemplate]);
        setEditingTemplate(convertToInstance(selectedTemplate));
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

    const handleSubmit = async (values: FormValues) => {
        isExistingMetadataInstance()
            ? updateMetadataInstance()
            : handleCreateMetadataInstance(values.metadata as MetadataTemplateInstance, () => setEditingTemplate(null));
    };

    const metadataDropdown = status === STATUS.SUCCESS && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={selectedTemplates as MetadataTemplate[]}
            onSelect={(selectedTemplate): void => {
                editingTemplate ? handleUnsavedChanges() : handleTemplateSelect(selectedTemplate);
            }}
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
                        isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                        isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                        onCancel={() => setEditingTemplate(null)}
                        onSubmit={handleSubmit}
                        onDelete={handleDeleteInstance}
                        template={editingTemplate}
                        setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                    />
                )}
                {showList && (
                    <MetadataInstanceList
                        isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                        onEdit={templateInstance => {
                            setEditingTemplate(templateInstance);
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
