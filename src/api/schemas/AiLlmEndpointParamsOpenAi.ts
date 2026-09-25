/**
 * @author Box
 */

export type AiLlmEndpointParamsOpenAiTypeField = 'openai_params';

export interface AiLlmEndpointParamsOpenAi {
    /**
     * The type of the AI LLM endpoint params object for OpenAI.
     */
    readonly type: AiLlmEndpointParamsOpenAiTypeField;
    /**
     * The sampling temperature, between 0 and 2. Higher values make the output more random, while lower values make it
     * more focused and deterministic. Alter this or `top_p`, but not both.
     */
    readonly temperature?: number;
    /**
     * The nucleus sampling probability mass. Alter this or `temperature`, but not both.
     */
    readonly top_p?: number;
    /**
     * A number between -2.0 and 2.0 that penalizes new tokens based on their existing frequency in the generated text.
     */
    readonly frequency_penalty?: number;
    /**
     * A number between -2.0 and 2.0 that penalizes new tokens based on whether they appear in the generated text.
     */
    readonly presence_penalty?: number;
    /**
     * Up to four sequences where the API stops generating further tokens.
     */
    readonly stop?: string;
}
