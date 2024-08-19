import * as React from 'react';
import getProp from 'lodash/get';
import { type MessageDescriptor } from 'react-intl';
import API from '../../../api';
import { type ElementsXhrError } from '../../../common/types/api';
import { isUserCorrectableError } from '../../../utils/error';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
} from '../../../constants';

import messages from '../../common/messages';

import { type BoxItem } from '../../../common/types/core';
import { MetadataTemplate, type MetadataEditor } from '../../../common/types/metadata';
import { type ErrorContextProps, type ExternalProps } from '../MetadataSidebarRedesign';

export enum Status {
    Idle = 'idle',
    Loading = 'loading',
    Error = 'error',
    Success = 'success',
}
interface DataFetcher {
    status: Status;
    file: BoxItem | null;
    errorMessage: MessageDescriptor | null;
    templates: Array<MetadataTemplate>;
}

function useSidebarMetadataFetcher(
    api: API,
    fileId: string,
    onError: ErrorContextProps['onError'],
    isFeatureEnabled: ExternalProps['isFeatureEnabled'],
): DataFetcher {
    const [status, setStatus] = React.useState<Status>(Status.Idle);
    const [file, setFile] = React.useState<BoxItem>(null);
    const [templates, setTemplates] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState<MessageDescriptor | null>(null);

    const onApiError = React.useCallback(
        (error: ElementsXhrError, code: string, message: MessageDescriptor) => {
            const { status: errorStatus } = error;
            const isValidError = isUserCorrectableError(errorStatus);
            setStatus(Status.Error);
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
            setStatus(Status.Success);
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
            const currentFileCanUpload = getProp(currentFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
            const newFileCanUpload = getProp(fetchedFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
            const shouldFetchMetadata = !currentFile || currentFileCanUpload !== newFileCanUpload;
            setFile(fetchedFile);
            if (shouldFetchMetadata && fetchedFile) {
                fetchMetadata(fetchedFile);
            } else {
                setStatus(Status.Success);
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
        if (status === Status.Idle) {
            setStatus(Status.Loading);
            api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
                fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
                refreshCache: true,
            });
        }
    }, [api, fetchFileErrorCallback, fetchFileSuccessCallback, fileId, status]);

    return {
        status,
        file,
        errorMessage,
        templates,
    };
}

export default useSidebarMetadataFetcher;
