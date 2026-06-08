// @flow
import type { MetadataTemplateField, MetadataTemplate, MetadataCascadePolicy } from '../../common/types/metadata';
import { CASCADE_POLICY_TYPE_AI_EXTRACT, CUSTOM_EXTRACT_AGENT_CONFIGURATION_PREFIX } from './constants';

const isHidden = (obj: MetadataTemplate | MetadataTemplateField): boolean => {
    return !!obj.isHidden || !!obj.hidden;
};

/**
 * Resolves the navigable numeric id of a custom Box AI extract agent from a cascade
 * policy's agent configuration value.
 *
 * A custom extract agent encodes its id as `extract_agent_<id>`. This strips the
 * known prefix and then removes any non-numeric characters from the remainder,
 * returning the resulting numeric id. An empty string means there is no navigable
 * agent id (the value did not carry the prefix, or nothing numeric remained).
 *
 * Callers should already know the configuration carries the custom prefix (see
 * `isCustomExtractAgentPolicy`); this only extracts the id and decides whether a
 * "manage agent" navigation target exists.
 *
 * @example
 * getCustomExtractAgentId('extract_agent_1234567890'); // '1234567890'
 * getCustomExtractAgentId('extract_agent_abc');          // '' (no navigable id)
 * getCustomExtractAgentId('enhanced_extract_agent');     // '' (no custom prefix)
 */
const getCustomExtractAgentId = (agentConfiguration?: ?string): string => {
    if (
        typeof agentConfiguration !== 'string' ||
        !agentConfiguration.startsWith(CUSTOM_EXTRACT_AGENT_CONFIGURATION_PREFIX)
    ) {
        return '';
    }
    return agentConfiguration.slice(CUSTOM_EXTRACT_AGENT_CONFIGURATION_PREFIX.length).replace(/\D/g, '');
};

/**
 * Determines whether a cascade policy is managed by a custom Box AI extract agent.
 *
 * A cascade policy reports `cascadePolicyType === 'ai_extract'` for every Box AI
 * autofill policy, so the type alone cannot distinguish a custom extract agent
 * (which is manageable) from the built-in standard/enhanced extraction modes. A
 * policy is custom-agent managed when it is an `ai_extract` policy whose agent
 * configuration carries the custom prefix (`extract_agent_`). Whether that prefix
 * is followed by a navigable numeric id is a separate concern resolved later via
 * `getCustomExtractAgentId` (e.g. to decide if a "manage agent" action is shown).
 *
 * @example
 * isCustomExtractAgentPolicy({ cascadePolicyType: 'ai_extract', cascadePolicyConfiguration: { agent: 'extract_agent_1234567890' } }); // true
 * isCustomExtractAgentPolicy({ cascadePolicyType: 'ai_extract', cascadePolicyConfiguration: { agent: 'enhanced_extract_agent' } });    // false
 */
const isCustomExtractAgentPolicy = (cascadePolicy?: MetadataCascadePolicy): boolean => {
    const agent = cascadePolicy?.cascadePolicyConfiguration?.agent;
    return (
        cascadePolicy?.cascadePolicyType === CASCADE_POLICY_TYPE_AI_EXTRACT &&
        !!agent &&
        agent.startsWith(CUSTOM_EXTRACT_AGENT_CONFIGURATION_PREFIX)
    );
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

export { getCustomExtractAgentId, isCustomExtractAgentPolicy, isHidden, normalizeTemplates, normalizeTemplateFilters };
