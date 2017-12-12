/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';

import BaseMultiput from '../BaseMultiput';

const sandbox = sinon.sandbox.create();

describe('api/BaseMultiput', () => {
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

    afterEach(() => {
        sandbox.verifyAndRestore();
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
                it('should POST to the correct endpoint', async () => {
                    BaseMultiputTest.sessionEndpoints.logEvent = 'logEvent';
                    BaseMultiputTest.xhr.post = sandbox
                        .mock()
                        .withArgs({
                            url: 'logEvent',
                            data: expectedData
                        })
                        .returns('expected');

                    assert.equal(await BaseMultiputTest.logEvent(event_type, eventInfo), 'expected');
                });
            }
        );
    });

    describe('consoleLogFunc()', () => {
        it('should not call msgFunc when canConsoleLog is false', async () => {
            BaseMultiputTest.canConsoleLog = false;

            BaseMultiputTest.consoleLogFunc(sandbox.mock().never());
        });

        it('should console log the return value of msgFunc when canConsoleLog is true', async () => {
            BaseMultiputTest.canConsoleLog = true;
            BaseMultiputTest.consoleLog = sandbox.mock().withArgs('expected');

            BaseMultiputTest.consoleLogFunc(sandbox.mock().returns('expected'));
        });
    });
});
