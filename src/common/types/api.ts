import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_OPTIONS, HTTP_HEAD } from '../../constants';
import { JSON_PATCH_OP_ADD, JSON_PATCH_OP_REMOVE, JSON_PATCH_OP_REPLACE, JSON_PATCH_OP_TEST } from '../constants';
import type { ElementOrigin } from '../../elements/common/flowTypes';
import type { StringAnyMap, StringMap, Token } from './core';
import type APICache from '../../utils/Cache';

interface Method {
    type:
        | typeof HTTP_DELETE
        | typeof HTTP_GET
        | typeof HTTP_POST
        | typeof HTTP_OPTIONS
        | typeof HTTP_HEAD
        | typeof HTTP_PUT;
}

interface JSONPatch {
    op:
        | typeof JSON_PATCH_OP_ADD
        | typeof JSON_PATCH_OP_REMOVE
        | typeof JSON_PATCH_OP_REPLACE
        | typeof JSON_PATCH_OP_TEST;
    path: string;
    value?: unknown;
}

type JSONPatchOperations = JSONPatch[];

interface RequestOptions {
    fields?: string[];
    forceFetch?: boolean;
    noPagination?: boolean;
    refreshCache?: boolean;
}

type PayloadType = StringAnyMap | StringAnyMap[];

interface RequestData {
    data: PayloadType;
    headers?: StringMap;
    id?: string;
    params?: StringAnyMap;
    url: string;
}

interface ErrorResponseData {
    code: string;
    context_info: Record<string, unknown>;
    help_url: string;
    message: string;
    request_id: string;
    status: number;
    type: 'error';
}

interface AxiosError<T = unknown> {
    response?: {
        data?: T;
        status?: number;
        headers?: Record<string, string>;
    };
    message: string;
    config?: Record<string, unknown>;
    code?: string;
    isAxiosError: boolean;
    toJSON: () => object;
}

type ElementsXhrError = AxiosError<unknown> | ErrorResponseData;

interface ElementsError {
    code: string;
    context_info: Record<string, unknown>;
    message: string;
    origin: ElementOrigin;
    type: 'error';
}

interface ErrorContextProps {
    onError: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Record<string, unknown>,
        origin?: ElementOrigin,
    ) => void;
}

type ElementsErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Record<string, unknown>) => void;

interface ElementsSuccess {
    code: string;
    showNotification: boolean;
}

interface APIOptions {
    apiHost?: string;
    cache?: APICache;
    clientName?: string;
    consoleError?: boolean;
    consoleLog?: boolean;
    id?: string;
    language?: string;
    requestInterceptor?: (config: Record<string, unknown>) => Record<string, unknown>;
    responseInterceptor?: (response: Record<string, unknown>) => Record<string, unknown>;
    retryableStatusCodes?: number[];
    sharedLink?: string;
    sharedLinkPassword?: string;
    shouldRetry?: boolean;
    token: Token;
    uploadHost?: string;
    version?: string;
}

export type {
    APIOptions,
    ElementOrigin,
    ElementsError,
    ElementsErrorCallback,
    ElementsSuccess,
    ElementsXhrError,
    ErrorContextProps,
    ErrorResponseData,
    RequestData,
    RequestOptions,
    JSONPatchOperations,
    Method,
    PayloadType,
    AxiosError,
};
