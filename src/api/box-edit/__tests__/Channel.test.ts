import Channel from '../Channel';
import CONSTANTS from '../constants';

const APP_NAME = 'dummy';

describe('lib/box-edit/Channel', () => {
    describe('buildNextRequestID()', () => {
        test('should return a string that contains performance.now', () => {
            const expected = `${CONSTANTS.REQUEST_ID_PRE}foo`;
            const channel = new Channel(APP_NAME);

            // Replace global instance of window with mock to avoid side effects
            channel.window = {
                performance: {
                    now: jest.fn().mockReturnValue('foo'),
                },
            };

            const result = channel.buildNextRequestID();

            expect(result).toEqual(expected);
        });
    });

    describe('buildDetailsObj()', () => {
        let channel;
        beforeEach(() => {
            channel = new Channel(APP_NAME);
            channel.buildNextRequestID = jest.fn().mockReturnValue('foo');
        });

        test('should return details object with data not set if operation type is OPERATION_STATUS', () => {
            const result = channel.buildDetailsObj(CONSTANTS.OPERATION_STATUS, 'foo', 111);
            expect(result.operation).toEqual(CONSTANTS.OPERATION_STATUS);
            expect(result.properties.application).toEqual(APP_NAME);
            expect(result.properties.timeout).toEqual('111');
            expect(result.req_id).toEqual('foo');
            expect(result.data).toEqual(undefined);
        });

        test('should return details object with data set if operation type is not OPERATION_STATUS', () => {
            const result = channel.buildDetailsObj(CONSTANTS.OPERATION_COMMAND, 'bar', 111);
            expect(result.operation).toEqual(CONSTANTS.OPERATION_COMMAND);
            expect(result.properties.application).toEqual(APP_NAME);
            expect(result.properties.timeout).toEqual('111');
            expect(result.req_id).toEqual('foo');
            expect(result.data).toEqual('bar');
        });

        test('should throw when operation type is not OPERATION_STATUS and data is not set', () => {
            try {
                channel.buildDetailsObj(CONSTANTS.OPERATION_COMMAND, undefined, 111);
            } catch (err) {
                expect(err).toBeInstanceOf(TypeError);
            }
        });
    });
});
