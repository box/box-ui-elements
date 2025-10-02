/**
 * @flow
 * @author Box
 */

export type AiLlmEndpointParamsGoogleTypeField = 'google_params';

export interface AiLlmEndpointParamsGoogle {
    /**
     * The type of the AI LLM endpoint params object for Google.
     */
    +type: AiLlmEndpointParamsGoogleTypeField;
    /**
     * The temperature is used for sampling during response generation, which occurs when `top-P` and `top-K` are applied.
    Temperature controls the degree of randomness in token selection.
     */
    +temperature?: number;
    /**
     * Top-P changes how the model selects tokens for output. Tokens are selected from the most (see `top-K`) to least probable
    until the sum of their probabilities equals the `top-P` value.
     */
    +top_p?: number;
    /**
     * Top-K changes how the model selects tokens for output. A top-K of 1 means the next selected token is the
    most probable among all tokens in the model's vocabulary (also called greedy decoding),
    while a top-K of 3 means that the next token is selected from among the three most probable tokens by using temperature.
     */
    +top_k?: number;
}
