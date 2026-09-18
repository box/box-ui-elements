/**
 * @author Box
 */

import type { AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi } from './AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi';

export interface AiAgentBasicTextTool {
    /**
     * The model to be used for the AI Agent for basic text.
     */
    readonly model?: string;
    /**
     * System messages try to help the LLM "understand" its role and what it is supposed to do.
     */
    readonly system_message?: string;
    /**
     * Prompt template containing contextual information and the user prompt. May include inputs for
     * `{current_date}`, `{user_question}`, and `{content}` depending on the use.
     */
    readonly prompt_template?: string;
    /**
     * The number of tokens for completion.
     */
    readonly num_tokens_for_completion?: number;
    /**
     * The parameters for the selected LLM endpoint.
     */
    readonly llm_endpoint_params?: AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi;
}
