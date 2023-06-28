import cloneDeep from 'lodash/cloneDeep';
import FileActivities from '../FileActivities';
import { ERROR_CODE_FETCH_ACTIVITY } from '../../constants';
import { fileActivities as mockFileActivities } from '../fixtures';

describe('api/FileActivities', () => {
    let fileActivities;

    beforeEach(() => {
        fileActivities = new FileActivities({});
        fileActivities.get = jest.fn();
    });

    afterEach(() => {
        fileActivities.destroy();
        fileActivities = null;
    });

    describe('getFilteredUrl()', () => {
        test.each`
            activityTypes                        | expected
            ${undefined}                         | ${''}
            ${[]}                                | ${''}
            ${['comment']}                       | ${'&activity_types=comment'}
            ${['comment', 'annotation', 'task']} | ${'&activity_types=comment,annotation,task'}
        `(
            'should return the filtered query parameters as $expected when $activityTypes is passed in',
            ({ activityTypes, expected }) => {
                expect(fileActivities.getFilteredUrl('1', activityTypes, true)).toBe(
                    `https://api.box.com/2.0/file_activities?file_id=1${expected}&enable_replies=true&reply_limit=1`,
                );
            },
        );

        test.each`
            enableReplies | expected
            ${true}       | ${'&enable_replies=true'}
            ${false}      | ${'&enable_replies=false'}
        `(
            'should return the enable_replies as $expected when $enableReplies is passed in',
            ({ enableReplies, expected }) => {
                expect(fileActivities.getFilteredUrl('1', ['comment', 'annotation', 'task'], enableReplies)).toBe(
                    `https://api.box.com/2.0/file_activities?file_id=1&activity_types=comment,annotation,task${expected}&reply_limit=1`,
                );
            },
        );
    });

    describe('getActivities()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should call the underlying get method', () => {
            const permissions = {
                can_comment: true,
            };

            fileActivities.getActivities({
                fileID: '123',
                activityTypes: ['comment', 'task'],
                permissions,
                successCallback,
                errorCallback,
                shouldShowReplies: true,
            });

            expect(fileActivities.get).toBeCalledWith({
                id: '123',
                errorCallback,
                requestData: {},
                successCallback,
                url:
                    'https://api.box.com/2.0/file_activities?file_id=123&activity_types=comment,task&enable_replies=true&reply_limit=1',
            });
        });

        test('should reject with an error code for calls with can_comment as false', () => {
            fileActivities.getActivities({
                fileID: '123',
                activityTypes: ['comment', 'task'],
                permissions: [{ can_comment: false }],
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_ACTIVITY);
            expect(fileActivities.get).not.toBeCalled();
        });
    });

    describe('successHandler()', () => {
        beforeEach(() => {
            fileActivities.successCallback = jest.fn();
        });

        test('should call the success callback if the response contains fileActivities', () => {
            const response = {
                entries: cloneDeep(mockFileActivities),
            };
            fileActivities.successHandler(response);
            expect(fileActivities.successCallback).toBeCalled();
        });
    });
});
