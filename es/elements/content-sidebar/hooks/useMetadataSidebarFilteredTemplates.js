import * as React from 'react';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';
export function useMetadataSidebarFilteredTemplates(history, filteredTemplateIds, templateInstances) {
  const [filteredTemplates, setFilteredTemplates] = React.useState([]);
  React.useEffect(() => {
    const matchingFilteredTemplateIds = templateInstances.filter(instance => filteredTemplateIds.includes(instance.id) && !instance.hidden).map(instance => instance.id);
    setFilteredTemplates(matchingFilteredTemplateIds);
  }, [filteredTemplateIds, templateInstances]);
  const handleSetFilteredTemplates = templateIds => {
    if (templateIds.length === 0) {
      history.push(`/${SIDEBAR_VIEW_METADATA}`);
    } else {
      history.push(`/${SIDEBAR_VIEW_METADATA}/filteredTemplates/${templateIds.join(',')}`);
    }
    setFilteredTemplates(templateIds);
  };
  const templateInstancesList = React.useMemo(() => {
    const filteredTemplateInstances = templateInstances.filter(instance => filteredTemplates.some(template => template === instance.id && !instance.hidden));
    return filteredTemplates.length === 0 ? templateInstances : filteredTemplateInstances;
  }, [templateInstances, filteredTemplates]);
  return {
    filteredTemplates,
    templateInstancesList,
    handleSetFilteredTemplates
  };
}
//# sourceMappingURL=useMetadataSidebarFilteredTemplates.js.map