import { ERROR_CODE_INTELLIGENCE } from '../../constants';
import Intelligence from '../Intelligence';

describe('api/Intelligence', () => {
    let errorCallback;
    let intelligence;
    let successCallback;
    const items = [{ id: '123', type: 'file' }];
    const prompt = 'summarize';

    beforeEach(() => {
        intelligence = new Intelligence({});
        successCallback = jest.fn();
        errorCallback = jest.fn();
    });

    test('should make request and call success handler', async () => {
        const data = { data: 'foo' };
        intelligence.xhr.post = jest.fn().mockReturnValueOnce(Promise.resolve(data));
        await intelligence.ask(prompt, items, successCallback, errorCallback);
        expect(successCallback).toBeCalledWith(data);
    });

    test('should call error handler', async () => {
        intelligence.xhr.post = jest.fn().mockReturnValueOnce(
            // eslint-disable-next-line prefer-promise-reject-errors
            Promise.reject({
                response: {
                    data: 'something',
                },
            }),
        );
        await intelligence.ask(prompt, items, successCallback, errorCallback);
        expect(errorCallback).toBeCalledWith('something', ERROR_CODE_INTELLIGENCE);
        expect(successCallback).not.toBeCalled();
    });

    test('should throw error if prompt is missing  ', async () => {
        try {
            await intelligence.ask('', items, successCallback, errorCallback);
        } catch (e) {
            expect(e.message).toEqual('Missing prompt!');
        }
    });

    test.each`
        badItems     | description
        ${undefined} | ${'undefined'}
        ${[]}        | ${'an empty array'}
    `('should throw error if items is $description ', async ({ badItems }) => {
        try {
            await intelligence.ask(prompt, badItems, successCallback, errorCallback);
            expect(true).toEqual(false); // should never hit this line, if it does then the test fails
        } catch (e) {
            expect(e.message).toEqual('Missing items!');
        }
    });

    test('should throw error if items is an array with an empty item ', async () => {
        try {
            await intelligence.ask(prompt, [{}], successCallback, errorCallback);
            expect(true).toEqual(false); // should never hit this line, if it does then the test fails
        } catch (e) {
            expect(e.message).toEqual('Invalid item!');
        }
    });
});
