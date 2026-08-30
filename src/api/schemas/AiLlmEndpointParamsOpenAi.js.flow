/**
 * @flow
 * @author Box
 */

export type AiLlmEndpointParamsOpenAiTypeField = 'openai_params';

export interface AiLlmEndpointParamsOpenAi {
    /**
     * The type of the AI LLM endpoint params object for OpenAI.
     */
    +type: AiLlmEndpointParamsOpenAiTypeField;
    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random,
    while lower values like 0.2 will make it more focused and deterministic.
    We generally recommend altering this or `top_p` but not both.
     */
    +temperature?: number;
    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results
    of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability
    mass are considered. We generally recommend altering this or temperature but not both.
     */
    +top_p?: number;
    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the
    text so far, decreasing the model's likelihood to repeat the same line verbatim.
     */
    +frequency_penalty?: number;
    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far,
    increasing the model's likelihood to talk about new topics.
     */
    +presence_penalty?: number;
    /**
     * Up to 4 sequences where the API will stop generating further tokens.
     */
    +stop?: string;
}
