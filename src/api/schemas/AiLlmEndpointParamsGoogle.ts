/**
 * @author Box
 */

export type AiLlmEndpointParamsGoogleTypeField = 'google_params';

export interface AiLlmEndpointParamsGoogle {
    /**
     * The type of the AI LLM endpoint params object for Google.
     */
    readonly type: AiLlmEndpointParamsGoogleTypeField;
    /**
     * The sampling temperature used during response generation. Temperature controls the degree of randomness in token
     * selection.
     */
    readonly temperature?: number;
    /**
     * The cumulative probability threshold used to select output tokens.
     */
    readonly top_p?: number;
    /**
     * The number of most probable tokens considered when selecting the next token.
     */
    readonly top_k?: number;
}
