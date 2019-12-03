/**
 * @flow
 * @file Base class for Tasks APIs
 * @author Box
 */

import Base from '../Base';
import {
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
} from '../../constants';
import type { APIOptions } from '../../common/types/api';

const RETRYABLE = [
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
];

class TasksBase extends Base {
    constructor({ retryableStatusCodes = RETRYABLE, ...options }: APIOptions) {
        super({ ...options, retryableStatusCodes });
    }
}

export default TasksBase;
