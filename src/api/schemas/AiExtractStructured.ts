/**
 * @author Box
 */

import type { AiAgentExtractStructured } from './AiAgentExtractStructured';
import type { AiAgentReference } from './AiAgentReference';
import type { AiItemBase } from './AiItemBase';

export type AiExtractStructuredMetadataTemplateTypeField = 'metadata_template';

export interface AiExtractStructuredMetadataTemplateField {
    /**
     * The name of the metadata template.
     */
    readonly template_key?: string;
    /**
     * Value is always `metadata_template`.
     */
    readonly type?: AiExtractStructuredMetadataTemplateTypeField;
    /**
     * The scope of the metadata template can either be global or enterprise_*. The global scope is used for
     * templates that are available to any Box enterprise. The enterprise_* scope represents templates that have
     * been created within a specific enterprise, where * is the ID of that enterprise.
     */
    readonly scope?: string;
}

export interface AiExtractStructuredFieldsOptionsField {
    /**
     * A unique identifier for the field.
     */
    readonly key: string;
}

export interface AiExtractStructuredFieldsField {
    /**
     * A unique identifier for the field.
     */
    readonly key: string;
    /**
     * A description of the field.
     */
    readonly description?: string;
    /**
     * The display name of the field.
     */
    readonly display_name?: string;
    /**
     * Context about the key that may include how to find and how to format it.
     */
    readonly prompt?: string;
    /**
     * The type of the field. Can include but is not limited to string, float, date, enum, and multiSelect.
     */
    readonly type?: string;
    /**
     * A list of options for this field. This is most often used in combination with the enum and multiSelect field
     * types.
     */
    readonly options?: ReadonlyArray<AiExtractStructuredFieldsOptionsField>;
}

export interface AiExtractStructured {
    /**
     * The items to be processed by the LLM, often files.
     */
    readonly items: ReadonlyArray<AiItemBase>;
    /**
     * The metadata template containing the fields to extract. Cannot be used in combination with `fields`.
     */
    readonly metadata_template?: AiExtractStructuredMetadataTemplateField;
    /**
     * The fields to be extracted from the items. Cannot be used in combination with `metadata_template`.
     */
    readonly fields?: ReadonlyArray<AiExtractStructuredFieldsField>;
    /**
     * The JSON blob that contains overrides for the agent config.
     */
    readonly agent_config?: string;
    /**
     * The AI Agent definition to use for extraction. Use `AiAgentExtractStructured` to customize basic-text or
     * long-text agents, or `AiAgentReference` to reference a custom AI Agent by ID.
     */
    readonly ai_agent?: AiAgentExtractStructured | AiAgentReference;
    /**
     * When `true`, the response includes confidence scores for each extracted field.
     */
    readonly include_confidence_score?: boolean;
    /**
     * When `true`, the response includes reference locations (bounding boxes) for each extracted field.
     */
    readonly include_reference?: boolean;
}
