import API from '../../api';
import type { WithLoggerProps } from '../../common/types/logging';
import type { ErrorContextProps } from '../../common/types/api';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';

export interface ExternalProps {
    isBoxAiSuggestionsFeatureEnabled: boolean;
    isFeatureEnabled: boolean;
    selectedTemplateKey?: string;
    templateFilters?: Array<string> | string;
}

export interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

// For some reason, when changing this type to an interface, the MetadataSidebarRedesign component throws an error on the onError prop.
export type MetadataSidebarRedesignProps = {
    api: API;
} & PropsWithoutContext &
    ErrorContextProps &
    WithLoggerProps;

export interface Metadata {
    editors: Array<MetadataEditor>;
    templates: Array<MetadataTemplate>;
}
