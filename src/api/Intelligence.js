/**
 * @flow
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import getProp from 'lodash/get';
import type { BoxItem } from '../common/types/core';
import { isUserCorrectableError } from '../utils/error.js';
import Base from './Base';
import { AiExtractResponse } from './schemas/AiExtractResponse.js';
import { AiExtractStructured } from './schemas/AiExtractStructured.js';
import { ERROR_CODE_EXTRACT_STRUCTURED } from '../constants';

class Intelligence extends Base {
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

    // /**
    //  * Gets suggestions for possible metadata key-value pairs for the given item
    //  *
    //  * @param {string} id - Id of the item to pull metadata from
    //  * @param {string} type - Type of item. Only "file” is supported.
    //  * @param {string} scope - The metadata template scope
    //  * @param {string} templateKey - The metadata template key to apply
    //  * @param {string} confidence - The confidence level the suggestion must surpass. Only “experimental” is supported.
    //  * @return {Array<MetadataSuggestion>} array of metadata templates
    //  */
    // async getMetadataSuggestions(
    //     id: string,
    //     type: typeof TYPE_FILE,
    //     scope: string,
    //     templateKey: string,
    //     confidence: typeof METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL = METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL,
    // ): Promise<Array<MetadataSuggestion>> {
    //     this.errorCode = ERROR_CODE_FETCH_METADATA_SUGGESTIONS;

    //     if (!id || type !== TYPE_FILE) {
    //         throw getBadItemError();
    //     }

    //     if (!scope) {
    //         throw new Error('Missing scope');
    //     }

    //     if (!templateKey) {
    //         throw new Error('Missing templateKey');
    //     }

    //     if (confidence !== METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL) {
    //         throw new Error(`Invalid confidence level: "${confidence}"`);
    //     }

    //     let suggestionsResponse = {};
    //     try {
    //         suggestionsResponse = await this.xhr.get({
    //             url: this.getMetadataSuggestionsUrl(),
    //             id: getTypedFileId(id),
    //             params: {
    //                 item: `${type}_${id}`,
    //                 scope,
    //                 template_key: templateKey,
    //                 confidence,
    //             },
    //         });
    //     } catch (e) {
    //         const { status } = e;
    //         if (isUserCorrectableError(status)) {
    //             throw e;
    //         }
    //     }
    //     return getProp(suggestionsResponse, 'data.suggestions', []);
    // }

    /**
     * Sends an AI request to supported LLMs and returns extracted key pairs and values.
     *
     * @param {AiExtractStructured} request - AI Extract Structured Request
     * @return A successful response including the answer from the LLM.
     */
    async extractStructured(request: AiExtractStructured): Promise<AiExtractResponse> {
        this.errorCode = ERROR_CODE_EXTRACT_STRUCTURED;

        const url = `${this.getBaseApiUrl()}/ai/extract_structured`;

        let suggestionsResponse = {};
        try {
            suggestionsResponse = await this.xhr.post({
                url,
                data: request,
            });
        } catch (e) {
            const { status } = e;
            if (isUserCorrectableError(status)) {
                throw e;
            }
        }
        return getProp(suggestionsResponse, 'data', {});
    }
}

export default Intelligence;
