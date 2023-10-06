/**
 * @flow
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import Base from './Base';
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
     * @return {Promise}
     */
    async ask(prompt: string, items: Array<BoxItem>) {
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

        return this.xhr.post({
            url,
            id: `file_${items[0].id}`,
            data: {
                mode: 'single_item_qa',
                prompt,
                items,
            },
        });
    }
}

export default Intelligence;
