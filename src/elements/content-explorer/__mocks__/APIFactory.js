/**
 * @flow
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../../utils/Cache';

import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../constants';

import type { APIOptions } from '../../common/types/api';

class APIFactory {
    constructor(options: APIOptions) {
        this.options = {
            ...options,
            apiHost: options.apiHost || DEFAULT_HOSTNAME_API,
            uploadHost: options.uploadHost || DEFAULT_HOSTNAME_UPLOAD,
            cache: options.cache || new Cache(),
            language: options.language,
        };
    }
}

export default APIFactory;
