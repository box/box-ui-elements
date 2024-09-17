/**
 * @flow
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import getProp from 'lodash/get';
import { QuestionType } from '@box/box-ai-content-answers';
import type { BoxItem } from '../common/types/core';
import { ERROR_CODE_EXTRACT_STRUCTURED } from '../constants';
import { isUserCorrectableError } from '../utils/error';
import Base from './Base';
import { AiExtractResponse } from './schemas/AiExtractResponse';
import { AiExtractStructured } from './schemas/AiExtractStructured';

class Intelligence extends Base {
    /**
     * API endpoint to ask ai a question
     *
     * @param {string} prompt - Question
     * @param {Array<object>} items - Array of items to ask about
     * @return {Promise}
     */
    async ask(question: QuestionType, items: Array<BoxItem>) {
        const { prompt } = question;
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
                include_citations: true,
            },
        });
    }

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
