/**
 * @flow
 * @author Box
 */

export interface AiExtractConfidenceScore {
    level: string;
    score: number;
}

export interface AiExtractReference {
    itemId: string;
    page: number;
    text: string;
    boundingBox?: {
        left: number,
        top: number,
        right: number,
        bottom: number,
    };
}

export interface AiAgentInfo {
    models?: Array<{
        name?: string,
        provider?: string,
        supported_purpose?: string,
    }>;
    processor?: string;
}

export interface AiExtractResponse {
    answer: { [key: string]: any };
    created_at: string;
    completion_reason?: string;
    confidence_score?: { [key: string]: AiExtractConfidenceScore };
    reference?: { [key: string]: Array<AiExtractReference> };
    ai_agent_info?: AiAgentInfo;
}
