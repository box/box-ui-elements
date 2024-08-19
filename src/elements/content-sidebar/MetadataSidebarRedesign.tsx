/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';

import { Text } from '@box/blueprint-web';
import { AddMetadataTemplateDropdown } from '@box/metadata-editor';

import API from '../../api';
import { type ElementsXhrError } from '../../common/types/api';
import { type ElementOrigin } from '../common/flowTypes';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_METADATA_SIDEBAR_REDESIGN } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import InlineError from '../../components/inline-error/InlineError';

import messages from '../common/messages';

import { MetadataTemplate } from '../../common/types/metadata';
import { type WithLoggerProps } from '../../common/types/logging';

import './MetadataSidebarRedesign.scss';
import useSidebarMetadataFetcher from './hooks/useSidebarMetadataFetcher';

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
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void;
}

export interface MetadataSidebarRedesignProps extends PropsWithoutContext, ErrorContextProps, WithLoggerProps {
    api: API;
}

function MetadataSidebarRedesign({ api, fileId, onError, isFeatureEnabled }: MetadataSidebarRedesignProps) {
    const [selectedTemplates, setSelectedTemplates] = React.useState<Array<MetadataTemplate>>([]);

    const { templates, errorMessage, status } = useSidebarMetadataFetcher(api, fileId, onError, isFeatureEnabled);

    const renderMetadataDropdown = status === 'success' && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={selectedTemplates}
            onSelect={(selectedTemplate): void => {
                setSelectedTemplates([...selectedTemplates, selectedTemplate]);
            }}
        />
    );

    const renderErrorMessage = status === 'error' && errorMessage && (
        <InlineError title={<FormattedMessage {...messages.error} />}>
            <FormattedMessage {...errorMessage} />
        </InlineError>
    );

    return (
        <div className="bcs-MetadataSidebarRedesign bcs-content">
            <div className="bcs-MetadataSidebarRedesign-header">
                <Text as="h3" variant="titleLarge">
                    <FormattedMessage {...messages.sidebarMetadataTitle} />
                </Text>
                {renderMetadataDropdown}
            </div>
            <div className="bcs-MetadataSidebarRedesign-content">
                {renderErrorMessage}
                {status === 'loading' && <LoadingIndicator />}
            </div>
        </div>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
