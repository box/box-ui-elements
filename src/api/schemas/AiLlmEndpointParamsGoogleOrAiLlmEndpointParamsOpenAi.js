/**
 * @flow
 * @author Box
 */

import { AiLlmEndpointParamsGoogle } from './AiLlmEndpointParamsGoogle.js';
import { AiLlmEndpointParamsOpenAi } from './AiLlmEndpointParamsOpenAi.js';

export type AiLlmEndpointParamsGoogleOrAiLlmEndpointParamsOpenAi =
    | AiLlmEndpointParamsGoogle
    | AiLlmEndpointParamsOpenAi;
