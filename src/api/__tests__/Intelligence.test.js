import Intelligence from '../Intelligence';

describe('api/Intelligence', () => {
    let intelligence;

    const mockItems = [{ id: '123', type: 'file' }];
    const mockPrompt = 'summarize';

    beforeEach(() => {
        intelligence = new Intelligence({});
    });

    test('should return promise with data', async () => {
        const data = { data: 'foo' };
        intelligence.xhr.post = jest.fn().mockReturnValueOnce(Promise.resolve(data));
        const response = await intelligence.ask(mockPrompt, mockItems);
        expect(response).toEqual(data);
    });

    test('should make post to xhr', async () => {
        const data = {
            data: {
                items: mockItems,
                mode: 'single_item_qa',
                prompt: mockPrompt,
            },
            id: 'file_123',
            url: 'https://api.box.com/2.0/ai/ask',
        };
        const postMock = jest.fn();
        intelligence.xhr.post = postMock.mockReturnValueOnce(Promise.resolve({}));
        await intelligence.ask(mockPrompt, mockItems);
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
            await intelligence.ask(mockPrompt, mockItems);
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
            await intelligence.ask(prompt, items);
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
            await intelligence.ask(prompt, badItems);
            expect(true).toEqual(false); // should never hit this line, if it does then the test fails
        } catch (e) {
            expect(e.message).toEqual('Missing items!');
        }
    });
});
