// @flow
import type { ElementOrigin } from '../../elements/common/flowTypes';

type FetchOptions = {
    fields?: Array<string>,
    forceFetch?: boolean,
    noPagination?: boolean,
    refreshCache?: boolean,
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

export type {
    FetchOptions,
    ErrorResponseData,
    ElementsXhrError,
    ElementOrigin,
    ElementsError,
    ErrorContextProps,
    ElementsErrorCallback,
};
