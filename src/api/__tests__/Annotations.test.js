import Annotations from '../Annotations';

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
            expect(annotations.getUrl()).toBe('https://api.box.com/2.0/internal_annotations');
        });
    });

    describe('getUrlForId()', () => {
        test('should return the correct url for a given annotation id', () => {
            expect(annotations.getUrlForId('test')).toBe('https://api.box.com/2.0/internal_annotations/test');
        });
    });

    describe('createAnnotation()', () => {
        test('should format its parameters and call the post method', () => {
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

            annotations.createAnnotation('12345', '67890', payload, successCallback, errorCallback);

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
                            type: 'version',
                        },
                        status: 'open',
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
                        type: 'annotation',
                    },
                },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/internal_annotations',
            });
        });
    });

    describe('deleteAnnotation()', () => {
        test('should format its parameters and call the delete method for a given id', () => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();

            annotations.deleteAnnotation('12345', 'abc', successCallback, errorCallback);

            expect(annotations.delete).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/internal_annotations/abc',
            });
        });
    });

    describe('getAnnotation()', () => {
        test('should format its parameters and call the get method', () => {
            const successCallback = jest.fn();
            const errorCallback = jest.fn();

            annotations.getAnnotation('12345', 'abc', successCallback, errorCallback);

            expect(annotations.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/internal_annotations/abc',
            });
        });
    });

    describe('getAnnotations()', () => {
        test('should format its parameters and call the underlying markerGet method', () => {
            const successCallback = jest.fn();
            const errorCallback = jest.fn();

            annotations.getAnnotations('12345', '67890', successCallback, errorCallback);

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
    });
});
