/**
 * @flow
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_INTELLIGENCE } from '../constants';
import type { BoxItem } from '../common/types/core';
import type { ElementsErrorCallback } from '../common/types/api';

class Intelligence extends Base {
    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: ElementsErrorCallback;

    /**
     * API endpoint to ask ai a question
     *
     * @param {string} prompt - Question
     * @param {Array<object>} items - Array of items to ask about
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {Promise}
     */
    async ask(prompt: string, items: Array<BoxItem>, successCallback: Function, errorCallback: ElementsErrorCallback) {
        this.errorCode = ERROR_CODE_INTELLIGENCE;
        if (!prompt) {
            throw new Error('Missing prompt!');
        }

        if (!items || items.length === 0) {
            throw new Error('Missing items!');
        }

        items.forEach(item => {
            if (!item.id || !item.type) {
                throw new Error('Invalid item!');
            }
        });

        const url = `${this.getBaseApiUrl()}/ai/ask`;

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        await this.xhr
            .post({
                url,
                id: items[0].id,
                data: {
                    mode: 'single_item_qa',
                    prompt,
                    items,
                },
            })
            .then(this.successHandler)
            .catch(this.errorHandler);
    }
}

export default Intelligence;
