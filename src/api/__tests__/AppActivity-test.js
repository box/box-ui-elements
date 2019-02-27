import AppActivity from '../AppActivity';
import { ERROR_CODE_DELETE_APP_ACTIVITY } from '../../constants';

let appActivity;

describe('api/AppActivity', () => {
    beforeEach(() => {
        appActivity = new AppActivity({});
    });

    afterEach(() => {
        appActivity.destroy();
        appActivity = null;
    });

    describe('mapAppActivityItem()', () => {
        test('should transform app activity entries to contain created_at instead of occurred_at', () => {
            const createdAtTime = '123456778';
            const entry = {
                occurred_at: createdAtTime,
            };

            const activityItem = appActivity.mapAppActivityItem(entry);

            expect(activityItem.created_at).toBe(createdAtTime);
            expect(activityItem.occurred_at).toBeUndefined();
        });
    });

    describe('getAppActivityUrl()', () => {
        test('should return the base app activity url', () => {
            expect(appActivity.getAppActivityUrl()).toBe('https://api.box.com/2.0/app_activities');
        });
    });

    describe('getUrl()', () => {
        test('should throw when not provided a file id', () => {
            expect(() => {
                appActivity.getUrl();
            }).toThrow();
        });
        test('should return correct aoo activity api url with id and fields', () => {
            expect(appActivity.getUrl('foo')).toBe(
                'https://api.box.com/2.0/app_activities?item_id=foo&item_type=file&fields=activity_template,app,created_by,occurred_at,rendered_text',
            );
        });
    });

    describe('getDeleteUrl()', () => {
        test('should throw when not provided a file id', () => {
            expect(() => {
                appActivity.getDeleteUrl();
            }).toThrow();
        });

        test('should return correct url for app activity deletion', () => {
            expect(appActivity.getDeleteUrl('ACTIVITY_ID')).toBe('https://api.box.com/2.0/app_activities/ACTIVITY_ID');
        });
    });

    describe('successHandler()', () => {
        test('should do nothing if already destroyed', () => {
            appActivity.successCallback = jest.fn();
            appActivity.destroy();

            appActivity.successHandler({});

            expect(appActivity.successCallback).not.toBeCalled();
        });

        test('should invoke success callback with new list of app activities', () => {
            const data = {
                entries: [],
            };
            appActivity.successCallback = jest.fn();

            appActivity.successHandler(data);

            expect(appActivity.successCallback).toBeCalledWith({
                entries: [],
                total_count: 0,
            });
        });
    });

    describe('getAppActivity()', () => {
        test('should pass through params to marketGet()', () => {
            appActivity.markerGet = jest.fn();
            const id = '987654321';
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const limit = 900;

            appActivity.getAppActivity(id, successCallback, errorCallback, limit);

            expect(appActivity.markerGet).toBeCalledWith({
                id,
                limit,
                successCallback,
                errorCallback,
            });
        });
    });

    describe('deleteAppActivity()', () => {
        beforeEach(() => {
            appActivity.delete = jest.fn();
        });

        test('should set error code to delete app activity error', () => {
            appActivity.deleteAppActivity({
                file: {},
                appActivityItem: { id: '123' },
                successCallback: jest.fn(),
                errorCallback: jest.fn(),
            });

            expect(appActivity.errorCode).toBe(ERROR_CODE_DELETE_APP_ACTIVITY);
        });

        test('should invoke delete', () => {
            appActivity.deleteAppActivity({
                file: {},
                appActivityItem: { id: '123' },
                successCallback: jest.fn(),
                errorCallback: jest.fn(),
            });

            expect(appActivity.delete).toBeCalled();
        });

        test('should invoke getDeleteUrl() to create the correct URL to delete app activity', () => {
            appActivity.getDeleteUrl = jest.fn();
            appActivity.deleteAppActivity({
                file: {},
                appActivityItem: { id: '123' },
                successCallback: jest.fn(),
                errorCallback: jest.fn(),
            });

            expect(appActivity.getDeleteUrl).toBeCalledWith('123');
        });

        test('should invoke delete with proper delete url for the app activity', () => {
            const fileId = '12345';
            const appActivityItemId = '09876';
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const deleteUrl = 'https://delete.my/app_activity/09876';
            appActivity.getDeleteUrl = jest.fn().mockReturnValue(deleteUrl);
            appActivity.deleteAppActivity({
                file: { id: fileId },
                appActivityItem: { id: appActivityItemId },
                successCallback,
                errorCallback,
            });

            expect(appActivity.delete).toBeCalledWith({
                id: fileId,
                url: deleteUrl,
                successCallback,
                errorCallback,
            });
        });
    });
});
