import { withData } from 'leche';
import BaseMultiput from '../BaseMultiput';

describe('api/uploads/BaseMultiput', () => {
    let BaseMultiputTest;

    beforeEach(() => {
        BaseMultiputTest = new BaseMultiput(
            {
                consoleLog: true
            },
            {},
            {}
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
                        event_type
                    }
                ],
                [
                    event_info,
                    {
                        event_type,
                        event_info
                    }
                ]
            ],
            (eventInfo, expectedData) => {
                test('should POST to the correct endpoint', async () => {
                    BaseMultiputTest.sessionEndpoints.logEvent = 'logEvent';
                    BaseMultiputTest.xhr.post = jest.fn().mockReturnValueOnce('expected');

                    expect(await BaseMultiputTest.logEvent(event_type, eventInfo)).toBe('expected');
                    expect(BaseMultiputTest.xhr.post).toHaveBeenCalledWith({
                        url: 'logEvent',
                        data: expectedData
                    });
                });
            }
        );
    });

    describe('consoleLogFunc()', () => {
        test('should not call msgFunc when canConsoleLog is false', async () => {
            BaseMultiputTest.canConsoleLog = false;
            const mock = jest.fn();
            BaseMultiputTest.consoleLogFunc(mock);
            expect(mock).not.toHaveBeenCalled();
        });

        test('should console log the return value of msgFunc when canConsoleLog is true', async () => {
            BaseMultiputTest.canConsoleLog = true;
            BaseMultiputTest.consoleLog = jest.fn();

            const mock = jest.fn().mockReturnValueOnce('expected');
            BaseMultiputTest.consoleLogFunc(mock);
            expect(BaseMultiputTest.consoleLog).toHaveBeenCalledWith('expected');
        });
    });
});
