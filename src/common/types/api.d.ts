import type { StringAnyMap, StringMap } from './core';
import Cache from '../../utils/Cache';

// Re-export types that are used by implementations
export type { StringAnyMap, StringMap };

export type Token = null | undefined | string | Function;

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
