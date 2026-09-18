/**
 * @author Box
 */

export interface AiExtractConfidenceScore {
    /** The qualitative confidence level. */
    level: string;
    /** The numeric confidence score. */
    score: number;
}

export interface AiExtractReference {
    /** The ID of the referenced item. */
    itemId: string;
    /** The page containing the referenced text. */
    page: number;
    /** The referenced text. */
    text: string;
    /** The position of the referenced text on the page. */
    boundingBox?: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
}

export interface AiAgentInfo {
    /** The models used by the AI Agent. */
    models?: Array<{
        name?: string;
        provider?: string;
        supported_purpose?: string;
    }>;
    /** The processor used by the AI Agent. */
    processor?: string;
}

export interface AiExtractResponse {
    /** The fields extracted from the supplied items. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Preserve the Flow schema's arbitrary answer values
    answer: { [key: string]: any };
    /** The date and time when the response was created. */
    created_at: string;
    /** The reason the extraction was completed. */
    completion_reason?: string;
    /** Confidence scores keyed by extracted field. */
    confidence_score?: { [key: string]: AiExtractConfidenceScore };
    /** References keyed by extracted field. */
    reference?: { [key: string]: Array<AiExtractReference> };
    /** Information about the AI Agent used for extraction. */
    ai_agent_info?: AiAgentInfo;
}
