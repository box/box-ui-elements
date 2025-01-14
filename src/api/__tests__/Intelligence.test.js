import { ERROR_CODE_EXTRACT_STRUCTURED, ERROR_CODE_AI_AGENT_DEFAULT } from '../../constants';
import Intelligence from '../Intelligence';

describe('api/Intelligence', () => {
    let intelligence;

    const mockItems = [{ id: '123', type: 'file' }];
    const mockPrompt = 'summarize';
    const mockQuestion = { prompt: mockPrompt };

    beforeEach(() => {
        intelligence = new Intelligence({});
    });

    test('should return promise with data', async () => {
        const data = { data: 'foo' };
        intelligence.xhr.post = jest.fn().mockReturnValueOnce(Promise.resolve(data));
        const response = await intelligence.ask(mockQuestion, mockItems);
        expect(response).toEqual(data);
    });

    test('should make post to xhr', async () => {
        const data = {
            data: {
                items: mockItems,
                mode: 'single_item_qa',
                prompt: mockPrompt,
                dialogue_history: [],
            },
            id: 'file_123',
            url: 'https://api.box.com/2.0/ai/ask',
        };
        const postMock = jest.fn();
        intelligence.xhr.post = postMock.mockReturnValueOnce(Promise.resolve({}));
        await intelligence.ask(mockQuestion, mockItems);
        expect(postMock).toBeCalledWith(data);
    });

    test('should make post to xhr with citations', async () => {
        const data = {
            data: {
                items: mockItems,
                mode: 'single_item_qa',
                prompt: mockPrompt,
                dialogue_history: [],
                include_citations: true,
            },
            id: 'file_123',
            url: 'https://api.box.com/2.0/ai/ask',
        };
        const postMock = jest.fn();
        intelligence.xhr.post = postMock.mockReturnValueOnce(Promise.resolve({}));
        await intelligence.ask(mockQuestion, mockItems, [], { include_citations: true });
        expect(postMock).toBeCalledWith(data);
    });

    test('should call error handler', async () => {
        intelligence.xhr.post = jest.fn().mockReturnValueOnce(
            // eslint-disable-next-line prefer-promise-reject-errors
            Promise.reject({
                response: {
                    data: 'bad',
                },
            }),
        );
        try {
            await intelligence.ask(mockQuestion, mockItems);
        } catch (e) {
            expect(e).toEqual({
                response: {
                    data: 'bad',
                },
            });
        }
    });

    test.each`
        prompt        | items        | message              | missing
        ${''}         | ${mockItems} | ${'Missing prompt!'} | ${'prompt'}
        ${mockPrompt} | ${[{}]}      | ${'Invalid item!'}   | ${'item'}
    `('should throw error if $missing is missing  ', async ({ prompt, items, message }) => {
        try {
            await intelligence.ask({ prompt }, items);
            expect(true).toEqual(false); // should never hit this line, if it does then the test fails
        } catch (e) {
            expect(e.message).toEqual(message);
        }
    });

    test.each`
        badItems     | description
        ${undefined} | ${'undefined'}
        ${[]}        | ${'an empty array'}
    `('should throw error if items is $description ', async ({ badItems }) => {
        try {
            await intelligence.ask(mockQuestion, badItems);
            expect(true).toEqual(false); // should never hit this line, if it does then the test fails
        } catch (e) {
            expect(e.message).toEqual('Missing items!');
        }
    });

    describe('extractStructured()', () => {
        const request = {
            items: [{ id: '123', type: 'file' }],
            metadata_template: {
                type: 'metadata_template',
                scope: 'global',
                template_key: 'myTestTemplate',
            },
        };

        test.each`
            items   | message
            ${[]}   | ${'Missing items!'}
            ${[{}]} | ${'Invalid item!'}
        `('should throw error with $message', async ({ items, message }) => {
            const req = { ...request, items };
            try {
                await intelligence.extractStructured(req);
                expect(true).toEqual(false); // should never hit this line, if it does then the test fails
            } catch (e) {
                expect(e.message).toEqual(message);
            }
        });

        test('should return a successful response including the answer from the LLM', async () => {
            const suggestionsFromServer = {
                stringFieldKey: 'fieldVal1',
                floatFieldKey: 124.0,
                enumFieldKey: 'EnumOptionKey',
                multiSelectFieldKey: ['multiSelectOption1', 'multiSelectOption5'],
            };
            intelligence.xhr.post = jest.fn().mockReturnValueOnce({
                data: suggestionsFromServer,
            });

            const suggestions = await intelligence.extractStructured(request);
            expect(suggestions).toEqual(suggestionsFromServer);
            expect(intelligence.xhr.post).toHaveBeenCalledWith({
                url: `${intelligence.getBaseApiUrl()}/ai/extract_structured`,
                id: 'file_123',
                data: request,
            });
        });

        test('should not return any suggestions when error is 400', async () => {
            const error = new Error();
            error.status = 400;
            intelligence.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let suggestions;
            try {
                suggestions = await intelligence.extractStructured(request);
            } catch (e) {
                expect(e.status).toEqual(400);
            }
            expect(intelligence.errorCode).toBe(ERROR_CODE_EXTRACT_STRUCTURED);
            expect(suggestions).toEqual(undefined);
            expect(intelligence.xhr.post).toHaveBeenCalledWith({
                url: `${intelligence.getBaseApiUrl()}/ai/extract_structured`,
                data: request, // request is the data
                id: 'file_123',
            });
        });

        test('should throw error when error is not 400', async () => {
            const error = new Error();
            error.status = 401;
            intelligence.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let suggestions;
            try {
                suggestions = await intelligence.extractStructured(request);
            } catch (e) {
                expect(e.status).toEqual(401);
            }
            expect(intelligence.errorCode).toBe(ERROR_CODE_EXTRACT_STRUCTURED);
            expect(suggestions).toBeUndefined();
            expect(intelligence.xhr.post).toHaveBeenCalledWith({
                url: `${intelligence.getBaseApiUrl()}/ai/extract_structured`,
                data: request,
                id: 'file_123',
            });
        });
    });

    describe('getAIDefaultConfig()', () => {
        test('should use authentication from options', async () => {
            const customToken = 'custom_token';
            intelligence = new Intelligence({ token: customToken });
            const data = {
                data: {
                    mode: 'ask',
                },
            };
            intelligence.xhr.get = jest.fn().mockReturnValueOnce(Promise.resolve(data));
            await intelligence.getAIDefaultConfig({ mode: 'ask' });
            expect(intelligence.options.token).toBe(customToken);
        });

        test('should throw error if mode is missing', async () => {
            try {
                await intelligence.getAIDefaultConfig({});
                expect(true).toEqual(false); // should never hit this line
            } catch (e) {
                expect(e.message).toEqual('Missing mode!');
            }
        });

        test('should make GET request with correct params', async () => {
            const data = {
                data: {
                    mode: 'ask',
                    language: 'en',
                },
            };
            intelligence.xhr.get = jest.fn().mockReturnValueOnce(Promise.resolve(data));
            const response = await intelligence.getAIDefaultConfig({ mode: 'ask', language: 'en' });
            expect(response).toEqual(data.data);
            expect(intelligence.xhr.get).toBeCalledWith({
                url: 'https://api.box.com/2.0/ai_agent_default',
                id: 'ai_agent_default',
                params: {
                    mode: 'ask',
                    language: 'en',
                },
            });
        });

        test('should make GET request without optional language param', async () => {
            const data = {
                data: {
                    mode: 'ask',
                },
            };
            intelligence.xhr.get = jest.fn().mockReturnValueOnce(Promise.resolve(data));
            const response = await intelligence.getAIDefaultConfig({ mode: 'ask' });
            expect(response).toEqual(data.data);
            expect(intelligence.xhr.get).toBeCalledWith({
                url: 'https://api.box.com/2.0/ai_agent_default',
                id: 'ai_agent_default',
                params: {
                    mode: 'ask',
                },
            });
        });

        test('should handle error response', async () => {
            const error = new Error();
            error.status = 400;
            intelligence.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            try {
                await intelligence.getAIDefaultConfig({ mode: 'ask' });
            } catch (e) {
                expect(e.status).toEqual(400);
            }
            expect(intelligence.errorCode).toBe(ERROR_CODE_AI_AGENT_DEFAULT);
        });
    });
});
