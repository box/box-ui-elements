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
                expect(fileActivities.getFilteredUrl('1', activityTypes)).toBe(
                    `https://api.box.com/2.0/file_activities?file_id=1${expected}&enable_replies=true&reply_limit=1`,
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
                can_view_annotations: true,
            };

            fileActivities.getActivities({
                fileID: '123',
                activityTypes: ['comment', 'task'],
                permissions,
                successCallback,
                errorCallback,
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

        test.each([
            { can_comment: true, can_view_annotations: false },
            { can_comment: false, can_view_annotations: true },
            { can_comment: false, can_view_annotations: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            fileActivities.getActivities({
                fileID: '123',
                activityTypes: ['comment', 'task'],
                permissions,
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
