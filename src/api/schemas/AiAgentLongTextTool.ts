/**
 * @author Box
 */

import type { AiAgentBasicTextTool } from './AiAgentBasicTextTool';

export interface AiAgentLongTextToolEmbeddingsStrategyField {
    /**
     * The strategy to be used for the AI Agent for calculating embeddings.
     */
    readonly id?: string;
    /**
     * The number of tokens per chunk.
     */
    readonly num_tokens_per_chunk?: number;
}

export interface AiAgentLongTextToolEmbeddingsField {
    /**
     * The model to be used for the AI Agent for calculating embeddings.
     */
    readonly model?: string;
    /**
     * The strategy configuration used to calculate embeddings.
     */
    readonly strategy?: AiAgentLongTextToolEmbeddingsStrategyField;
}

export type AiAgentLongTextTool = AiAgentBasicTextTool & {
    /** The embeddings configuration for long-text processing. */
    readonly embeddings?: AiAgentLongTextToolEmbeddingsField;
};
