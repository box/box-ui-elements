import { withData } from 'leche';
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

        withData(
            [
                [
                    null,
                    {
                        event_type,
                    },
                ],
                [
                    event_info,
                    {
                        event_type,
                        event_info,
                    },
                ],
            ],
            (eventInfo, expectedData) => {
                test('should POST to the correct endpoint', async () => {
                    BaseMultiputTest.sessionEndpoints.logEvent = 'logEvent';
                    BaseMultiputTest.xhr.post = jest
                        .fn()
                        .mockReturnValueOnce('expected');

                    expect(
                        await BaseMultiputTest.logEvent(event_type, eventInfo),
                    ).toBe('expected');
                    expect(BaseMultiputTest.xhr.post).toHaveBeenCalledWith({
                        url: 'logEvent',
                        data: expectedData,
                    });
                });
            },
        );
    });
});
