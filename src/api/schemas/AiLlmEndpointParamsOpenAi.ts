export type AiLlmEndpointParamsOpenAiTypeField = 'openai_params';

export interface AiLlmEndpointParamsOpenAi {
    /**
     * The sampling temperature, between 0 and 2. Higher values make the output more random, while lower values make it
     * more focused and deterministic. Alter this or `top_p`, but not both.
     */
    readonly type: AiLlmEndpointParamsOpenAiTypeField;

    /** Sampling temperature (0–2). Alter this or `top_p`, but not both. */
    readonly temperature?: number;

    /** Nucleus sampling probability mass. Alter this or `temperature`, but not both. */
    readonly top_p?: number;

    /** Penalty (-2.0 to 2.0) for tokens based on existing frequency in the generated text. */
    readonly frequency_penalty?: number;

    /** Penalty (-2.0 to 2.0) for tokens based on whether they appear in the generated text. */
    readonly presence_penalty?: number;

    /** Up to four sequences where the API stops generating further tokens. */
    readonly stop?: string;
}
