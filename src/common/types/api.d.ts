import type { StringAnyMap, StringMap } from './core';
import Cache from '../../utils/Cache';

// Re-export types that are used by implementations
export type { StringAnyMap, StringMap };

export type Token = null | undefined | string | Function;

export interface ErrorResponseData {
    code: string;
    context_info?: Record<string, unknown>;
    help_url?: string;
    message?: string;
    request_id?: string;
    status?: number;
    type?: string;
}

export interface ElementsXhrError extends Error {
    code?: string;
    status?: number;
    response?: {
        status: number;
        code: string;
    };
}

export interface APIOptions {
    apiHost?: string;
    cache?: Cache;
    clientName?: string;
    consoleError?: boolean;
    consoleLog?: boolean;
    id?: string;
    language?: string;
    requestInterceptor?: Function;
    responseInterceptor?: Function;
    retryableStatusCodes?: Array<number>;
    sharedLink?: string;
    sharedLinkPassword?: string;
    shouldRetry?: boolean;
    token: Token;
    uploadHost?: string;
    version?: string;
}
