/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { Text } from '@box/blueprint-web';
import { AddMetadataTemplateDropdown } from '@box/metadata-editor';

import API from '../../api';
import { type ElementsXhrError } from '../../common/types/api';
import { type ElementOrigin } from '../common/flowTypes';
import { isUserCorrectableError } from '../../utils/error';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
} from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import InlineError from '../../components/inline-error/InlineError';

import messages from '../common/messages';

import { type BoxItem } from '../../common/types/core';
import { MetadataTemplate, type MetadataEditor } from '../../common/types/metadata';
import { type WithLoggerProps } from '../../common/types/logging';

import './MetadataSidebarRedesign.scss';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

interface ExternalProps {
    isFeatureEnabled: boolean;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

interface ErrorContextProps {
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void;
}

export interface MetadataSidebarRedesignProps extends PropsWithoutContext, ErrorContextProps, WithLoggerProps {
    api: API;
}

type Status = 'idle' | 'loading' | 'error' | 'success';
interface DataFetcher {
    status: Status;
    file: BoxItem | null;
    errorMessage: MessageDescriptor | null;
    templates: Array<MetadataTemplate>;
}

function useDataFetching(
    api: API,
    fileId: string,
    onError: ErrorContextProps['onError'],
    isFeatureEnabled: ExternalProps['isFeatureEnabled'],
): DataFetcher {
    const [status, setStatus] = React.useState<Status>('idle');
    const [file, setFile] = React.useState<BoxItem>(null);
    const [templates, setTemplates] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState<MessageDescriptor | null>(null);

    const onApiError = React.useCallback(
        (error: ElementsXhrError, code: string, message: MessageDescriptor) => {
            const { status: errorStatus } = error;
            const isValidError = isUserCorrectableError(errorStatus);
            setStatus('error');
            setErrorMessage(message);
            onError(error, code, {
                error,
                [IS_ERROR_DISPLAYED]: isValidError,
            });
        },
        [onError],
    );

    const fetchMetadataSuccessCallback = React.useCallback(
        ({ templates: fetchedTemplates }: { editors: Array<MetadataEditor>; templates: Array<MetadataTemplate> }) => {
            setErrorMessage(null);
            setStatus('success');
            setTemplates(fetchedTemplates);
        },
        [],
    );

    const fetchMetadataErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string) => {
            setTemplates(null);
            onApiError(e, code, messages.sidebarMetadataFetchingErrorContent);
        },
        [onApiError],
    );

    const fetchMetadata = React.useCallback(
        (fetchedFile: BoxItem) => {
            api.getMetadataAPI(false).getMetadata(
                fetchedFile,
                fetchMetadataSuccessCallback,
                fetchMetadataErrorCallback,
                isFeatureEnabled,
                { refreshCache: true },
            );
        },
        [api, fetchMetadataErrorCallback, fetchMetadataSuccessCallback, isFeatureEnabled],
    );

    const fetchFileSuccessCallback = React.useCallback(
        (fetchedFile: BoxItem) => {
            const { currentFile } = file ?? {};
            const currentCanUpload = getProp(currentFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
            const newCanUpload = getProp(fetchedFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
            const shouldFetchMetadata = !currentFile || currentCanUpload !== newCanUpload;
            setFile(fetchedFile);
            if (shouldFetchMetadata && fetchedFile) {
                fetchMetadata(fetchedFile);
            } else {
                setStatus('success');
            }
        },
        [fetchMetadata, file],
    );

    const fetchFileErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string) => {
            setFile(undefined);
            onApiError(e, code, messages.sidebarMetadataEditingErrorContent);
        },
        [onApiError],
    );

    React.useEffect(() => {
        setStatus('loading');
        api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
            fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
            refreshCache: true,
        });
        // this effect is suppose to run only once when component is loaded for a given file
        // when all dependencies are listed components goes into infinite rerender loop
        // even if functions are wrapped in useCallback
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId]);

    return {
        status,
        file,
        errorMessage,
        templates,
    };
}

function MetadataSidebarRedesign({ api, fileId, onError, isFeatureEnabled }: MetadataSidebarRedesignProps) {
    const [selectedTemplates, setSelectedTemplates] = React.useState<Array<MetadataTemplate>>([]);

    const { templates, errorMessage, status } = useDataFetching(api, fileId, onError, isFeatureEnabled);

    return (
        <div className="bcs-MetadataSidebarRedesign bcs-content">
            <div className="bcs-MetadataSidebarRedesign-header">
                <Text as="h3" variant="titleLarge">
                    <FormattedMessage {...messages.sidebarMetadataTitle} />
                </Text>
                {status === 'success' && templates && (
                    <AddMetadataTemplateDropdown
                        availableTemplates={templates}
                        selectedTemplates={selectedTemplates}
                        onSelect={(selectedTemplate): void => {
                            setSelectedTemplates([...selectedTemplates, selectedTemplate]);
                        }}
                    />
                )}
            </div>
            <div className="bcs-MetadataSidebarRedesign-content">
                {status === 'error' && errorMessage && (
                    <InlineError title={<FormattedMessage {...messages.error} />}>
                        <FormattedMessage {...errorMessage} />
                    </InlineError>
                )}
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
