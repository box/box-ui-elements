import cloneDeep from 'lodash/cloneDeep';
import Annotations from '../Annotations';
import {
    ERROR_CODE_CREATE_ANNOTATION,
    ERROR_CODE_CREATE_REPLY,
    ERROR_CODE_FETCH_REPLIES,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATIONS,
} from '../../constants';
import { formatComment } from '../utils';
import {
    annotations as mockAnnotations,
    threadedComments as mockThreadedComments,
    threadedCommentsFormatted as mockThreadedCommentsFormatted,
} from '../fixtures';

const mockFormattedReply = cloneDeep(mockThreadedCommentsFormatted[1]);
jest.mock('../utils', () => ({ formatComment: jest.fn(() => mockFormattedReply) }));

describe('api/Annotations', () => {
    let annotations;

    beforeEach(() => {
        annotations = new Annotations({});
        annotations.delete = jest.fn();
        annotations.get = jest.fn();
        annotations.markerGet = jest.fn();
        annotations.post = jest.fn();
        annotations.put = jest.fn();
    });

    afterEach(() => {
        annotations.destroy();
        annotations = null;
    });

    describe('getUrl()', () => {
        test('should the return correct url for annotations', () => {
            expect(annotations.getUrl()).toBe('https://api.box.com/2.0/undoc/annotations');
        });
    });

    describe('getUrlForId()', () => {
        test('should return the correct url for a given annotation id', () => {
            expect(annotations.getUrlForId('test')).toBe('https://api.box.com/2.0/undoc/annotations/test');
        });
    });

    describe('getUrlWithRepliesForId()', () => {
        test('should return the correct url for replies for given annotation id', () => {
            expect(annotations.getUrlWithRepliesForId('test')).toBe(
                'https://api.box.com/2.0/undoc/annotations/test/replies',
            );
        });
    });

    describe('createAnnotation()', () => {
        const payload = {
            description: {
                message: 'This is a test message.',
            },
            target: {
                location: {
                    type: 'page',
                    value: 1,
                },
                shape: {
                    height: 50,
                    type: 'rect',
                    width: 50,
                    x: 10,
                    y: 10,
                },
                type: 'region',
            },
        };
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the post method', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.createAnnotation('12345', '67890', payload, permissions, successCallback, errorCallback);

            expect(annotations.post).toBeCalledWith({
                id: '12345',
                data: {
                    data: {
                        description: {
                            message: 'This is a test message.',
                            type: 'reply',
                        },
                        file_version: {
                            id: '67890',
                            type: 'file_version',
                        },
                        target: payload.target,
                    },
                },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations',
            });
        });

        test.each([
            { can_create_annotations: false, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: true },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.createAnnotation('12345', '67890', payload, permissions, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_CREATE_ANNOTATION);
            expect(annotations.post).not.toBeCalled();
        });
    });

    describe('updateAnnotation()', () => {
        test('should format its parameters and call the update method for a given id and mesaage', () => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();
            const payload = { message: 'hello' };
            annotations.updateAnnotation('12345', 'abc', { can_edit: true }, payload, successCallback, errorCallback);

            expect(annotations.put).toBeCalledWith({
                id: '12345',
                data: { data: { description: { message: 'hello' } } },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/abc',
            });
        });

        test('should format its parameters and call the update method for a given id and status', () => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();
            const payload = { status: 'resolved' };
            annotations.updateAnnotation(
                '12345',
                'abc',
                { can_resolve: true },
                payload,
                successCallback,
                errorCallback,
            );

            expect(annotations.put).toBeCalledWith({
                id: '12345',
                data: {
                    data: {
                        description: undefined,
                        status: 'resolved',
                    },
                },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/abc',
            });
        });

        test.each([
            { can_resolve: true, can_edit: false },
            { can_resolve: false, can_edit: true },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();
            const payload = { message: 'hello', status: 'resolved' };
            annotations.updateAnnotation('12345', '67890', permissions, payload, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_EDIT_ANNOTATION);
            expect(annotations.put).not.toBeCalled();
        });
    });

    describe('deleteAnnotation()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the delete method for a given id', () => {
            annotations.deleteAnnotation('12345', 'abc', { can_delete: true }, successCallback, errorCallback);

            expect(annotations.delete).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/abc',
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            annotations.deleteAnnotation('12345', '67890', { can_delete: false }, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_DELETE_ANNOTATION);
            expect(annotations.delete).not.toBeCalled();
        });
    });

    describe('getAnnotation()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the get method', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.getAnnotation('12345', 'abc', permissions, successCallback, errorCallback);

            expect(annotations.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/abc',
                requestData: undefined,
            });
        });

        test('should format its parameters and call the get method with replies', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.getAnnotation('12345', 'abc', permissions, successCallback, errorCallback, true);

            expect(annotations.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/abc',
                requestData: { params: { fields: 'replies' } },
            });
        });

        test.each([
            { can_create_annotations: true, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.getAnnotation('12345', '67890', permissions, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_ANNOTATION);
            expect(annotations.get).not.toBeCalled();
        });
    });

    describe('getAnnotations()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the underlying markerGet method', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.getAnnotations('12345', '67890', permissions, successCallback, errorCallback);

            expect(annotations.markerGet).toBeCalledWith({
                id: '12345',
                errorCallback,
                requestData: {
                    file_id: '12345',
                    file_version_id: '67890',
                },
                successCallback,
            });
        });

        test('should format its parameters and call the underlying markerGet with additional requestData', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.getAnnotations('12345', '67890', permissions, successCallback, errorCallback, 100, false, true);

            expect(annotations.markerGet).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback: expect.any(Function),
                limit: 100,
                shouldFetchAll: false,
                requestData: {
                    file_id: '12345',
                    file_version_id: '67890',
                    fields: 'replies',
                },
            });
        });

        test.each([
            { can_create_annotations: true, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.getAnnotations('12345', '67890', permissions, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_ANNOTATIONS);
            expect(annotations.markerGet).not.toBeCalled();
        });
    });

    describe('getAnnotationReplies()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the get method', () => {
            const permissions = {
                can_create_annotations: true,
                can_view_annotations: true,
            };

            annotations.getAnnotationReplies('12345', '67890', permissions, successCallback, errorCallback);

            expect(annotations.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/67890/replies',
            });
        });

        test.each([
            { can_create_annotations: true, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.getAnnotationReplies('12345', '67890', permissions, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_REPLIES);
            expect(annotations.get).not.toBeCalled();
        });
    });

    describe('createAnnotationReply()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();
        const message = 'Hello';

        test('should format its parameters and call the post method', () => {
            const permissions = {
                can_create_annotations: true,
            };
            annotations.createAnnotationReply('12345', '67890', permissions, message, successCallback, errorCallback);
            expect(annotations.post).toBeCalledWith({
                id: '12345',
                data: { data: { message } },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/annotations/67890/replies',
            });
        });
        test.each([
            { can_create_annotations: false, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: true },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.createAnnotationReply('12345', '67890', permissions, message, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_CREATE_REPLY);
            expect(annotations.post).not.toBeCalled();
        });
    });

    describe('successHandler()', () => {
        beforeEach(() => {
            annotations.formatReplies = jest.fn();
            annotations.successCallback = jest.fn();
        });

        test('should call the success callback with no data if none provided from API', () => {
            annotations.successHandler();
            expect(annotations.successCallback).toBeCalledWith();
        });

        test('should call formatReplies method and call the success callback if the response does not contain entries property', () => {
            const response = cloneDeep(mockAnnotations[0]);
            annotations.successHandler(response);
            expect(annotations.formatReplies).toBeCalledWith(response);
            expect(annotations.successCallback).toBeCalled();
        });

        test('should call formatComment util and call the success callback if the response does not contain entries property and has type = comment', () => {
            const response = cloneDeep(mockThreadedComments[0]);
            annotations.successHandler(response);
            expect(formatComment).toBeCalledWith(response);
            expect(annotations.successCallback).toBeCalled();
        });

        test('should call formatComment util, not call the formatReplies method and should call the success callback if the response contains comments (replies)', () => {
            const response = {
                entries: cloneDeep(mockThreadedComments),
                limit: 1000,
                next_marker: null,
            };
            annotations.successHandler(response);
            expect(formatComment).toBeCalled();
            expect(annotations.formatReplies).not.toBeCalled();
            expect(annotations.successCallback).toBeCalled();
        });

        test('should call formatReplies method and call the success callback if the response contains annotations', () => {
            const response = {
                entries: cloneDeep(mockAnnotations),
                limit: 1000,
                next_marker: null,
            };
            annotations.successHandler(response);
            expect(annotations.formatReplies).toBeCalled();
            expect(annotations.successCallback).toBeCalled();
        });
    });

    describe('formatReplies()', () => {
        test('should return annotation with formatted replies when replies are present', () => {
            const annotation = { id: '1234', replies: [{ id: '567' }] };
            const expectedUpdatedAnnotation = { ...annotation, replies: [mockFormattedReply] };
            const updatedAnnotation = annotations.formatReplies(annotation);

            expect(updatedAnnotation).toMatchObject(expectedUpdatedAnnotation);
        });

        test('should return given annotation when replies are not present', () => {
            const annotation = { id: '1234' };
            const updatedAnnotation = annotations.formatReplies(annotation);

            expect(updatedAnnotation).toMatchObject(annotation);
        });
    });
});
