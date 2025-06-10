/**
 * @flow
 * @author Box
 */

import { AiAgentExtractStructured } from './AiAgentExtractStructured';
import { AiAgentReference } from './AiAgentReference';
import { AiItemBase } from './AiItemBase';

export type AiExtractStructuredMetadataTemplateTypeField = 'metadata_template';

export interface AiExtractStructuredMetadataTemplateField {
    /**
     * The name of the metadata template.
     */
    +template_key?: string;
    /**
     * Value is always `metadata_template`.
     */
    +type?: AiExtractStructuredMetadataTemplateTypeField;
    /**
     * The scope of the metadata template can either be global or
    enterprise_*. The global scope is used for templates that are
    available to any Box enterprise. The enterprise_* scope represents
    templates that have been created within a specific enterprise,
    where * will be the ID of that enterprise.
     */
    +scope?: string;
}

export interface AiExtractStructuredFieldsOptionsField {
    /**
     * A unique identifier for the field.
     */
    +key: string;
}

export interface AiExtractStructuredFieldsField {
    /**
     * A unique identifier for the field.
     */
    +key: string;
    /**
     * A description of the field.
     */
    +description?: string;
    /**
     * The display name of the field.
     */
    +display_name?: string;
    /**
     * Context about the key that may include how to find and how to format it.
     */
    +prompt?: string;
    /**
     * The type of the field. Can include but is not limited to string, float, date, enum, and multiSelect.
     */
    +type?: string;
    /**
     * A list of options for this field. This is most often used in combination with the enum and multiSelect field types.
     */
    +options?: $ReadOnlyArray<AiExtractStructuredFieldsOptionsField>;
}

export interface AiExtractStructured {
    /**
     * The items to be processed by the LLM, often files.
     */
    +items: $ReadOnlyArray<AiItemBase>;
    /**
     * The metadata template containing the fields to extract. Cannot be used
    in combination with `fields`.
     */
    +metadata_template?: AiExtractStructuredMetadataTemplateField;
    /**
     * The fields to be extracted from the items. Cannot be used in combination
    with `metadata_template`.
     */
    +fields?: $ReadOnlyArray<AiExtractStructuredFieldsField>;
    /**
     * The JSON blob that contains overrides for the agent config.
     */
    +agent_config?: string;
    /**
     * The AI Agent to be used for extraction. Use AiAgentExtractStructured to customize Basic Text or Long Text agents.
     * Use AiAgentReference to pass a custom AI Agent ID.
     */
    +ai_agent?: AiAgentExtractStructured | AiAgentReference;
}
