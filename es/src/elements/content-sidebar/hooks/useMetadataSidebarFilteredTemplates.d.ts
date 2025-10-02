import { RouteComponentProps } from 'react-router-dom';
import { type MetadataTemplateInstance } from '@box/metadata-editor';
type History = RouteComponentProps['history'];
interface MetadataSidebarFilter {
    filteredTemplates: string[];
    templateInstancesList: MetadataTemplateInstance[];
    handleSetFilteredTemplates: (templateIds: string[]) => void;
}
export declare function useMetadataSidebarFilteredTemplates(history: History, filteredTemplateIds: string[], templateInstances: MetadataTemplateInstance[]): MetadataSidebarFilter;
export {};
