import * as React from 'react';
import getProp from 'lodash/get';
import { type MessageDescriptor } from 'react-intl';
import {
    type JSONPatchOperations,
    type MetadataTemplate,
    type MetadataTemplateInstance,
    type MetadataTemplateField,
} from '@box/metadata-editor';
import isEmpty from 'lodash/isEmpty';
import API from '../../../api';
import { type ElementsXhrError } from '../../../common/types/api';
import { isUserCorrectableError } from '../../../utils/error';
import {
    ERROR_CODE_EMPTY_METADATA_SUGGESTIONS,
    ERROR_CODE_FETCH_METADATA_SUGGESTIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    FIELD_PERMISSIONS,
} from '../../../constants';

import messages from '../../common/messages';

import { type BoxItem } from '../../../common/types/core';
import { type ErrorContextProps, type ExternalProps } from '../MetadataSidebarRedesign';

export enum STATUS {
    IDLE = 'idle',
    LOADING = 'loading',
    ERROR = 'error',
    SUCCESS = 'success',
}

interface DataFetcher {
    errorMessage: MessageDescriptor | null;
    extractSuggestions: (templateKey: string, fields: MetadataTemplateField[]) => Promise<MetadataTemplateField[]>;
    file: BoxItem | null;
    handleCreateMetadataInstance: (
        templateInstance: MetadataTemplateInstance,
        successCallback: () => void,
    ) => Promise<void>;
    handleDeleteMetadataInstance: (metadataInstance: MetadataTemplateInstance) => Promise<void>;
    handleUpdateMetadataInstance: (
        metadataTemplateInstance: MetadataTemplateInstance,
        JSONPatch: Array<Object>,
        successCallback: () => void,
    ) => Promise<void>;
    status: STATUS;
    templateInstances: Array<MetadataTemplateInstance>;
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
    const [templateInstances, setTemplateInstances] = React.useState<Array<MetadataTemplateInstance>>([]);

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
        ({
            templates: fetchedTemplates,
            templateInstances: fetchedTemplateInstances,
        }: {
            templates: Array<MetadataTemplate>;
            templateInstances: Array<MetadataTemplateInstance>;
        }) => {
            setErrorMessage(null);
            setStatus(STATUS.SUCCESS);
            setTemplateInstances(fetchedTemplateInstances);
            setTemplates(fetchedTemplates);
        },
        [],
    );

    const fetchMetadataErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string) => {
            setTemplates(null);
            setTemplateInstances(null);
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
                true,
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

    const handleDeleteMetadataInstance = React.useCallback(
        async (metadataInstance: MetadataTemplateInstance): Promise<void> => {
            if (!file || !metadataInstance) {
                return;
            }
            setStatus(STATUS.LOADING);
            await api
                .getMetadataAPI(false)
                .deleteMetadata(file, metadataInstance, () => setStatus(STATUS.SUCCESS), onApiError, true);
        },
        [api, onApiError, file],
    );

    const handleCreateMetadataInstance = React.useCallback(
        async (templateInstance: MetadataTemplateInstance, successCallback: () => void): Promise<void> => {
            await api
                .getMetadataAPI(false)
                .createMetadataRedesign(
                    file,
                    templateInstance,
                    successCallback,
                    (error: ElementsXhrError, code: string) =>
                        onApiError(error, code, messages.sidebarMetadataEditingErrorContent),
                );
        },
        [api, file, onApiError],
    );

    const handleUpdateMetadataInstance = React.useCallback(
        async (
            metadataInstance: MetadataTemplateInstance,
            JSONPatch: JSONPatchOperations,
            successCallback: () => void,
        ) => {
            await api
                .getMetadataAPI(false)
                .updateMetadataRedesign(
                    file,
                    metadataInstance,
                    JSONPatch,
                    successCallback,
                    (error: ElementsXhrError, code: string) => {
                        onApiError(error, code, messages.sidebarMetadataEditingErrorContent);
                    },
                );
        },
        [api, file, onApiError],
    );

    const extractSuggestions = React.useCallback(
        async (templateKey: string, fields: MetadataTemplateField[]) => {
            const aiAPI = api.getIntelligenceAPI();

            let answer = {};
            try {
                answer = await aiAPI.extractStructured({
                    items: [{ id: file.id, type: file.type }],
                    fields,
                });
            } catch (error) {
                onError(error, ERROR_CODE_FETCH_METADATA_SUGGESTIONS, { showNotification: true });
            }

            if (isEmpty(answer)) {
                const error = new Error('No suggestions found.');
                onError(error, ERROR_CODE_EMPTY_METADATA_SUGGESTIONS, { showNotification: true });
            }

            return fields.map(field => {
                const value = answer[field.key];
                if (!value) {
                    return field;
                }
                return {
                    ...field,
                    aiSuggestion: value,
                };
            });
        },
        [api, file, onError],
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
        extractSuggestions,
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        handleUpdateMetadataInstance,
        errorMessage,
        file,
        status,
        templateInstances,
        templates,
    };
}

export default useSidebarMetadataFetcher;
