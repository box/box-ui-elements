import { type MessageDescriptor } from 'react-intl';
import { type MetadataTemplate, type MetadataTemplateInstance, type MetadataTemplateField } from '@box/metadata-editor';
import API from '../../../api';
import { ERROR_CODE_METADATA_AUTOFILL_TIMEOUT, ERROR_CODE_UNKNOWN, ERROR_CODE_METADATA_PRECONDITION_FAILED } from '../../../constants';
import { type BoxItem } from '../../../common/types/core';
import { type ErrorContextProps, type ExternalProps, type SuccessContextProps } from '../MetadataSidebarRedesign';
export declare enum STATUS {
    IDLE = "idle",
    LOADING = "loading",
    ERROR = "error",
    SUCCESS = "success"
}
interface DataFetcher {
    clearExtractError: () => void;
    errorMessage: MessageDescriptor | null;
    extractErrorCode: ERROR_CODE_METADATA_AUTOFILL_TIMEOUT | ERROR_CODE_METADATA_PRECONDITION_FAILED | ERROR_CODE_UNKNOWN | null;
    extractSuggestions: (templateKey: string, scope: string, agentId?: string) => Promise<MetadataTemplateField[]>;
    file: BoxItem | null;
    handleCreateMetadataInstance: (templateInstance: MetadataTemplateInstance, successCallback: () => void) => Promise<void>;
    handleDeleteMetadataInstance: (metadataInstance: MetadataTemplateInstance) => Promise<void>;
    handleUpdateMetadataInstance: (metadataTemplateInstance: MetadataTemplateInstance, JSONPatch: Array<Object>, successCallback: () => void) => Promise<void>;
    status: STATUS;
    templateInstances: Array<MetadataTemplateInstance>;
    templates: Array<MetadataTemplate>;
}
declare function useSidebarMetadataFetcher(api: API, fileId: string, onError: ErrorContextProps['onError'], onSuccess: SuccessContextProps['onSuccess'], isFeatureEnabled: ExternalProps['isFeatureEnabled']): DataFetcher;
export default useSidebarMetadataFetcher;
