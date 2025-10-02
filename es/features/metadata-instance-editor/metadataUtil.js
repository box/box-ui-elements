const isHidden = obj => {
  return !!obj.isHidden || !!obj.hidden;
};

/**
 * Utility function for converting a string or array of strings into a Set object
 * @param templateFilters - Array<string> | string
 * @returns {Set<T>}
 */
const normalizeTemplateFilters = templateFilters => {
  return typeof templateFilters === 'string' ? new Set([templateFilters]) : new Set(templateFilters);
};

/**
 * Utility function for cloning an array of metadata templates and filtering the templates and fields if necessary
 * @param templates Array<MetadataTemplate>
 * @param selectedTemplateKey - string
 * @param templateFilters - Array<string> | string
 * @returns {Array<T>}
 */
const normalizeTemplates = (templates, selectedTemplateKey, templateFilters) => {
  if (!selectedTemplateKey) {
    return [...templates];
  }
  const clonedTemplates = templates.filter(template => template.templateKey === selectedTemplateKey);
  const fields = clonedTemplates[0] ? clonedTemplates[0].fields : null;
  if (templateFilters && fields) {
    const normalizedFilters = normalizeTemplateFilters(templateFilters);
    clonedTemplates[0].fields = fields.filter(field => normalizedFilters.has(field.id));
  }
  return clonedTemplates;
};
export { isHidden, normalizeTemplates, normalizeTemplateFilters };
//# sourceMappingURL=metadataUtil.js.map