// @flow
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_OPTIONS, HTTP_HEAD } from '../../constants';
import { JSON_PATCH_OP_ADD, JSON_PATCH_OP_REMOVE, JSON_PATCH_OP_REPLACE, JSON_PATCH_OP_TEST } from '../constants';
import type { ElementOrigin } from '../../elements/common/flowTypes';
import type { StringAnyMap, StringMap, Token } from './core';
import type APICache from '../../utils/Cache';

type Method =
    | typeof HTTP_DELETE
    | typeof HTTP_GET
    | typeof HTTP_POST
    | typeof HTTP_OPTIONS
    | typeof HTTP_HEAD
    | typeof HTTP_PUT;

type JSONPatch = {
    op:
        | typeof JSON_PATCH_OP_ADD
        | typeof JSON_PATCH_OP_REMOVE
        | typeof JSON_PATCH_OP_REPLACE
        | typeof JSON_PATCH_OP_TEST,
    path: string,
    value?: any,
};

type JSONPatchOperations = Array<JSONPatch>;

type RequestOptions = {
    fields?: Array<string>,
    forceFetch?: boolean,
    noPagination?: boolean,
    refreshCache?: boolean,
};

type PayloadType = StringAnyMap | Array<StringAnyMap>;

type RequestData = {
    data: PayloadType,
    headers?: StringMap,
    id?: string,
    params?: StringAnyMap,
    url: string,
};

type ErrorResponseData = {
    code: string,
    context_info: Object,
    help_url: string,
    message: string,
    request_id: string,
    status: number,
    type: 'error',
};

type ElementsXhrError = $AxiosError<any> | ErrorResponseData;

type ElementsError = {
    code: string,
    context_info: Object,
    message: string,
    origin: ElementOrigin,
    type: 'error',
};

type ErrorContextProps = {
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void,
};

type ElementsErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Object) => void;

type ElementsSuccess = {
    code: string,
    showNotification: boolean,
};

type APIOptions = {
    apiHost?: string,
    cache?: APICache,
    clientName?: string,
    consoleError?: boolean,
    consoleLog?: boolean,
    id?: string,
    language?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    retryableStatusCodes?: Array<number>,
    sharedLink?: string,
    sharedLinkPassword?: string,
    shouldRetry?: boolean,
    token: Token,
    uploadHost?: string,
    version?: string,
};

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
};
