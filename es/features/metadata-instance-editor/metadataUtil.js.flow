// @flow
import type { MetadataTemplateField, MetadataTemplate } from '../../common/types/metadata';

const isHidden = (obj: MetadataTemplate | MetadataTemplateField): boolean => {
    return !!obj.isHidden || !!obj.hidden;
};

/**
 * Utility function for converting a string or array of strings into a Set object
 * @param templateFilters - Array<string> | string
 * @returns {Set<T>}
 */
const normalizeTemplateFilters = (templateFilters: Array<string> | string): Set<string> => {
    return typeof templateFilters === 'string' ? new Set([templateFilters]) : new Set(templateFilters);
};

/**
 * Utility function for cloning an array of metadata templates and filtering the templates and fields if necessary
 * @param templates Array<MetadataTemplate>
 * @param selectedTemplateKey - string
 * @param templateFilters - Array<string> | string
 * @returns {Array<T>}
 */
const normalizeTemplates = (
    templates: Array<MetadataTemplate>,
    selectedTemplateKey?: string,
    templateFilters?: Array<string> | string,
): Array<MetadataTemplate> => {
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
