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
    type MetadataTemplateInstance,
    type MetadataTemplate,
} from '@box/metadata-editor';

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
    const { formatMessage } = useIntl();

    const [selectedTemplates, setSelectedTemplates] = React.useState<Array<MetadataTemplate>>([]);
    const [editingTemplate, setEditingTemplate] = React.useState<MetadataTemplateInstance | MetadataTemplate | null>(
        null,
    );
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = React.useState<boolean>(false);

    const { file, templates, errorMessage, status, templateInstances } = useSidebarMetadataFetcher(
        api,
        fileId,
        onError,
        isFeatureEnabled,
    );

    const handleUnsavedChanges = () => {
        setIsUnsavedChangesModalOpen(true);
    };

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        setSelectedTemplates([...selectedTemplates, selectedTemplate]);
        setEditingTemplate(selectedTemplate);
    };

    const metadataDropdown = status === STATUS.SUCCESS && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={selectedTemplates}
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
    const showEmptyState = showTemplateInstances && templateInstances.length === 0 && !editingTemplate;

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
                {status === STATUS.LOADING && (
                    <LoadingIndicator aria-label={formatMessage(messages.loading)} data-testid="loading" />
                )}
                {showEmptyState ? (
                    <MetadataEmptyState level={'file'} isBoxAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled} />
                ) : (
                    editingTemplate && (
                        <MetadataInstanceEditor
                            isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                            template={editingTemplate}
                        />
                    )
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
