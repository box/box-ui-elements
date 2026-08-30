/**
 * @flow
 * @author Box
 */

import type { AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi } from './AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi';

export interface AiAgentBasicTextTool {
    /**
     * The model to be used for the AI Agent for basic text.
     */
    +model?: string;
    /**
     * System messages try to help the LLM "understand" its role and what it is supposed to do.
     */
    +system_message?: string;
    /**
     * Prompt template will have the contextual information of the request and then the user prompt as well.
    May include inputs for `{current_date}`, `{user_question}`, and `{content}` depending on the use.
     */
    +prompt_template?: string;
    /**
     * The number of tokens for completion.
     */
    +num_tokens_for_completion?: number;
    /**
     * The parameters for the LLM endpoint specific to OpenAI models.
     */
    +llm_endpoint_params?: AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi;
}
