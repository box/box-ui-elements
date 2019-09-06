// @flow

/**
 * Utility function for converting a string or array of strings into a Set object
 * @param templateFilters - Array<string> | string
 * @returns {Set<T>}
 */
const convertTemplateFilters = (templateFilters: Array<string> | string): Set<string> => {
    return typeof templateFilters === 'string' ? new Set([templateFilters]) : new Set(templateFilters);
};

const isHidden = (obj: MetadataTemplate | MetadataTemplateField): boolean => {
    return !!obj.isHidden || !!obj.hidden;
};

export { convertTemplateFilters, isHidden };
