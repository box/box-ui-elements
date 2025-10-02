/**
 * @flow
 * @author Box
 */

import { AiAgentBasicTextTool } from './AiAgentBasicTextTool';

export interface AiAgentLongTextToolEmbeddingsStrategyField {
    /**
     * The strategy to be used for the AI Agent for calculating embeddings.
     */
    +id?: string;
    /**
     * The number of tokens per chunk.
     */
    +num_tokens_per_chunk?: number;
}

export interface AiAgentLongTextToolEmbeddingsField {
    /**
     * The model to be used for the AI Agent for calculating embeddings.
     */
    +model?: string;
    +strategy?: AiAgentLongTextToolEmbeddingsStrategyField;
}

export type AiAgentLongTextTool = AiAgentBasicTextTool & {
    +embeddings?: AiAgentLongTextToolEmbeddingsField,
};
