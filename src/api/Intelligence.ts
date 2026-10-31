import type { QuestionType } from '@box/box-ai-content-answers';
import Base from './Base';
import type { AiExtractResponse } from './schemas/AiExtractResponse';
import type { AiExtractStructured } from './schemas/AiExtractStructured';
import { ERROR_CODE_EXTRACT_STRUCTURED } from '../constants';
import type { BoxItem, StringAnyMap } from '../common/types/core';

class Intelligence extends Base {
    /**
     * API endpoint to ask ai a question
     *
     * @param question - Object should at least contain the prompt, which is the question to ask
     * @param items - Array of items to ask about
     * @param dialogueHistory - Array of previous questions object that already have answers
     * @param options - Optional parameters
     */
    async ask(
        question: QuestionType,
        items: Array<BoxItem>,
        dialogueHistory: Array<QuestionType> = [],
        options: { include_citations?: boolean } = {},
    ): Promise<StringAnyMap> {
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
    }

    /**
     * Sends an AI request to supported LLMs and returns extracted key pairs and values.
     *
     * @return A successful response including the answer from the LLM.
     */
    async extractStructured(request: AiExtractStructured): Promise<AiExtractResponse> {
        this.errorCode = ERROR_CODE_EXTRACT_STRUCTURED;

        const { items } = request;
        if (!items || items.length === 0) {
            throw new Error('Missing items!');
        }

        const item = items[0];

        if (!item.id || !item.type) {
            throw new Error('Invalid item!');
        }

        // See: https://developer.box.com/reference/post-ai-extract-structured
        const url = `${this.getBaseApiUrl()}/ai/extract_structured`;

        const suggestionsResponse = await this.xhr.post({
            url,
            data: request,
            id: `file_${item.id}`,
        });

        return suggestionsResponse.data;
    }
}

export default Intelligence;
