/**
 * @author Box
 */

import type { AiLlmEndpointParamsGoogle } from './AiLlmEndpointParamsGoogle';
import type { AiLlmEndpointParamsOpenAi } from './AiLlmEndpointParamsOpenAi';

export type AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi =
    | AiLlmEndpointParamsGoogle
    | AiLlmEndpointParamsOpenAi;
