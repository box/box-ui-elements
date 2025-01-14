/**
 * @flow
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import getProp from 'lodash/get';
import Base from './Base';
import { ERROR_CODE_EXTRACT_STRUCTURED, ERROR_CODE_AI_AGENT_DEFAULT } from '../constants';

/* eslint-disable no-unused-vars */
import type { AiExtractResponse } from './schemas/AiExtractResponse';
import type { AiExtractStructured } from './schemas/AiExtractStructured';
import type { AiAgentDefaultConfig } from './schemas/AiAgentDefaultConfig';

type BoxItem = {|
    id: string,
    type: string,
|};
/* eslint-enable no-unused-vars */

class Intelligence extends Base {
    /**
     * API endpoint to ask ai a question
     *
     * @param {Object} question - Question object containing prompt
     * @param {Array<BoxItem>} items - Array of items to ask about
     * @param {Array<Object>} [dialogueHistory=[]] - Array of previous questions
     * @param {Object} [options={}] - Optional parameters
     * @param {boolean} [options.include_citations] - Whether to include citations
     * @returns {Promise<any>}
     */
    ask = async (question, items, dialogueHistory = [], options = {}) => {
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
                dialogue_history: dialogueHistory,
                ...options,
            },
        });
    };

    /**
     * Sends an AI request to supported LLMs and returns extracted key pairs and values.
     *
     * @param {AiExtractStructured} request - AI Extract Structured Request
     * @returns {Promise<AiExtractResponse>}
     */
    extractStructured = async request => {
        this.errorCode = ERROR_CODE_EXTRACT_STRUCTURED;

        const { items } = request;
        if (!items || items.length === 0) {
            throw new Error('Missing items!');
        }

        const item = items[0];

        if (!item.id || !item.type) {
            throw new Error('Invalid item!');
        }

        const url = `${this.getBaseApiUrl()}/ai/extract_structured`;

        const suggestionsResponse = await this.xhr.post({
            url,
            data: request,
            id: `file_${item.id}`,
        });

        return getProp(suggestionsResponse, 'data');
    };

    /**
     * Gets the AI agent default configuration
     *
     * @param {AiAgentDefaultConfig} options - Configuration options
     * @returns {Promise<Object>}
     */
    getAIDefaultConfig = async options => {
        this.errorCode = ERROR_CODE_AI_AGENT_DEFAULT;

        const { mode, language } = options;
        if (!mode) {
            throw new Error('Missing mode!');
        }

        const url = `${this.getBaseApiUrl()}/ai_agent_default`;
        const requestData = {
            params: {
                mode,
                ...(language && { language }),
            },
        };

        const { data } = await this.xhr.get({
            url,
            id: 'ai_agent_default',
            ...requestData,
        });

        return data;
    };
}

export default Intelligence;
