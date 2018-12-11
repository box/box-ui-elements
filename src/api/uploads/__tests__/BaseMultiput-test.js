import BaseMultiput from '../BaseMultiput';

describe('api/uploads/BaseMultiput', () => {
    let BaseMultiputTest;

    beforeEach(() => {
        BaseMultiputTest = new BaseMultiput(
            {
                consoleLog: true,
            },
            {},
            {},
        );
    });

    describe('logEvent()', () => {
        const event_type = 'event_type';
        const event_info = 'event_info';

        test.each`
            eventInfo     | expectedData
            ${null}       | ${{ event_type }}
            ${event_info} | ${{ event_type, event_info }}
        `('should POST to the correct endpoint', async ({ eventInfo, expectedData }) => {
            BaseMultiputTest.sessionEndpoints.logEvent = 'logEvent';
            BaseMultiputTest.xhr.post = jest.fn().mockReturnValueOnce('expected');

            expect(await BaseMultiputTest.logEvent(event_type, eventInfo)).toBe('expected');
            expect(BaseMultiputTest.xhr.post).toHaveBeenCalledWith({
                url: 'logEvent',
                data: expectedData,
            });
        });
    });
});
