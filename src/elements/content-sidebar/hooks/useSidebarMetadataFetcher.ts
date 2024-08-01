import * as React from 'react';
import getProp from 'lodash/get';
import { type MessageDescriptor } from 'react-intl';
import API from '../../../api';
import { type ElementsXhrError } from '../../../common/types/api';
import { isUserCorrectableError } from '../../../utils/error';
import { FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS, FIELD_PERMISSIONS_CAN_UPLOAD, IS_ERROR_DISPLAYED} from '../../../constants';

import messages from '../../common/messages';

import { type BoxItem } from '../../../common/types/core';
import { MetadataTemplate, type MetadataEditor } from '../../../common/types/metadata';
import { type ErrorContextProps, type ExternalProps } from '../MetadataSidebarRedesign';

export enum STATUS {
    IDLE = 'idle',
    LOADING = 'loading',
    ERROR = 'error',
    SUCCESS = 'success',
}
interface DataFetcher {
    editors: Array<MetadataEditor>;
    file: BoxItem | null;
    errorMessage: MessageDescriptor | null;
    status: STATUS;
    templates: Array<MetadataTemplate>;
}

function useSidebarMetadataFetcher(
    api: API,
    fileId: string,
    onError: ErrorContextProps['onError'],
    isFeatureEnabled: ExternalProps['isFeatureEnabled'],
): DataFetcher {
    const [status, setStatus] = React.useState<STATUS>(STATUS.IDLE);
    const [file, setFile] = React.useState<BoxItem>(null);
    const [templates, setTemplates] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState<MessageDescriptor | null>(null);
    const [editors, setEditors] = React.useState<Array<MetadataEditor>>([]);

    const onApiError = React.useCallback(
        (error: ElementsXhrError, code: string, message: MessageDescriptor) => {
            const { status: errorStatus } = error;
            const isValidError = isUserCorrectableError(errorStatus);
            setStatus(STATUS.ERROR);
            setErrorMessage(message);
            onError(error, code, {
                error,
                isErrorDisplayed: isValidError,
            });
        },
        [onError],
    );

    const fetchMetadataSuccessCallback = React.useCallback(
        ({ editors: fetchedEditors, templates: fetchedTemplates }: { editors: Array<MetadataEditor>; templates: Array<MetadataTemplate> }) => {
            setEditors(fetchedEditors);
            setErrorMessage(null);
            setStatus(STATUS.SUCCESS);
            setTemplates(fetchedTemplates);
        },
        [],
    );

    const fetchMetadataErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string) => {
            setEditors(null);
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
                setStatus(STATUS.SUCCESS);
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
        if (status === STATUS.IDLE) {
            setStatus(STATUS.LOADING);
            api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
                fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
                refreshCache: true,
            });
        }
    }, [api, fetchFileErrorCallback, fetchFileSuccessCallback, fileId, status]);

    return {
        file,
        editors,
        errorMessage,
        status,
        templates,
    };
}

export default useSidebarMetadataFetcher;
