import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { type MetadataTemplateInstance } from '@box/metadata-editor';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';

type History = RouteComponentProps['history'];

interface MetadataSidebarFilter {
    filteredTemplates: string[];
    templateInstancesList: MetadataTemplateInstance[];
    handleSetFilteredTemplates: (templateIds: string[]) => void;
}

export function useMetadataSidebarFilteredTemplates(
    history: History,
    filteredTemplateIds: string[],
    templateInstances: MetadataTemplateInstance[],
): MetadataSidebarFilter {
    const [filteredTemplates, setFilteredTemplates] = React.useState([]);

    React.useEffect(() => {
        const matchingFilteredTemplateIds = templateInstances
            .filter(instance => filteredTemplateIds.includes(instance.id) && !instance.hidden)
            .map(instance => instance.id);

        setFilteredTemplates(matchingFilteredTemplateIds);
    }, [filteredTemplateIds, templateInstances]);

    const handleSetFilteredTemplates = (templateIds: string[]) => {
        if (templateIds.length === 0) {
            history.push(`/${SIDEBAR_VIEW_METADATA}`);
        } else {
            history.push(`/${SIDEBAR_VIEW_METADATA}/filteredTemplates/${templateIds.join(',')}`);
        }
        setFilteredTemplates(templateIds);
    };

    const templateInstancesList = React.useMemo(() => {
        const filteredTemplateInstances = templateInstances.filter((instance: MetadataTemplateInstance) =>
            filteredTemplates.some((template: string) => template === instance.id && !instance.hidden),
        );
        return filteredTemplates.length === 0 ? templateInstances : filteredTemplateInstances;
    }, [templateInstances, filteredTemplates]);

    return { filteredTemplates, templateInstancesList, handleSetFilteredTemplates };
}
