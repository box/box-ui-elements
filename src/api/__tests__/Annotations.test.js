import Annotations from '../Annotations';
import {
    ERROR_CODE_CREATE_ANNOTATION,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATIONS,
} from '../../constants';

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
                        status: 'open',
                        target: payload.target,
                        type: 'annotation',
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

        test.each([
            { can_create_annotations: true, can_view_annotations: false },
            { can_create_annotations: false, can_view_annotations: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            annotations.getAnnotations('12345', '67890', permissions, successCallback, errorCallback);

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_ANNOTATIONS);
            expect(annotations.get).not.toBeCalled();
        });
    });
});
