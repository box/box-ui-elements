import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { createMemoryHistory, History, Location } from 'history';
import { Action, Annotator, AnnotatorContext, withAnnotations, Status } from '../index';
import { WithAnnotationsProps, ComponentWithAnnotations } from '../withAnnotations';

type ComponentProps = {
    className?: string;
    history?: History;
    location?: Location;
};

type WrappedProps = ComponentProps & Partial<WithAnnotationsProps>;
type WrapperType = ShallowWrapper<WrappedProps, {}, Component & ComponentWithAnnotations>;

describe('elements/common/annotator-context/withAnnotations', () => {
    const defaults = {
        className: 'foo',
        onAnnotator: jest.fn(),
        onError: jest.fn(),
        onPreviewDestroy: jest.fn(),
    };
    const MockComponent = (props: ComponentProps) => <div {...props} />;
    const WrappedComponent = withAnnotations(MockComponent);

    const getWrapper = (props: WrappedProps = {}): WrapperType =>
        shallow(<WrappedComponent {...defaults} {...props} />);
    const getContextProvider = (wrapper: WrapperType) => wrapper.find(AnnotatorContext.Provider);
    let mockAnnotator = {} as Annotator;

    beforeEach(() => {
        mockAnnotator = {
            addListener: jest.fn(),
            emit: jest.fn(),
            removeAllListeners: jest.fn(),
            removeListener: jest.fn(),
        };
    });

    describe('constructor', () => {
        test('should parse the history location pathname to initialize state with activeAnnotationId', () => {
            const history = createMemoryHistory({ initialEntries: ['/activity/annotations/123/456'] }) as History;
            const wrapper = getWrapper({ history, location: history.location });
            expect(wrapper.state('activeAnnotationId')).toBe('456');
        });

        test('should not initialize state with activeAnnotationId if history path does not match deeplink schema', () => {
            const history = createMemoryHistory({ initialEntries: ['/activity/annotations/456'] }) as History;
            const wrapper = getWrapper({ history, location: history.location });
            expect(wrapper.state('activeAnnotationId')).toBe(null);
        });
    });

    test('should pass onAnnotator and onPreviewDestroy as props on the wrapped component', () => {
        const wrapper = getWrapper();
        const wrappedComponent = wrapper.find<WrappedProps>(MockComponent);

        expect(wrappedComponent.exists()).toBeTruthy();
        expect(wrappedComponent.props().onAnnotator).toBeTruthy();
        expect(wrappedComponent.props().onPreviewDestroy).toBeTruthy();
    });

    test('should pass the context on to the AnnotatorContext.Provider', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const contextProvider = getContextProvider(wrapper);

        expect(contextProvider.exists()).toBeTruthy();
        expect(contextProvider.prop('value').emitActiveChangeEvent).toEqual(instance.emitActiveChangeEvent);
        expect(contextProvider.prop('value').emitRemoveEvent).toEqual(instance.emitRemoveEvent);
        expect(contextProvider.prop('value').getAnnotationsMatchPath).toEqual(instance.getMatchPath);
        expect(contextProvider.prop('value').getAnnotationsPath).toEqual(instance.getAnnotationsPath);
        expect(contextProvider.prop('value').state).toEqual({
            action: null,
            activeAnnotationFileVersionId: null,
            activeAnnotationId: null,
            annotation: null,
            error: null,
            meta: null,
        });
    });

    describe('emitActiveChangeEvent', () => {
        test('should call annotator emit on action', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            // Set the annotator on the withAnnotations instance
            instance.handleAnnotator(mockAnnotator);
            instance.emitActiveChangeEvent('123');

            expect(mockAnnotator.emit).toBeCalled();
            expect(mockAnnotator.emit).toBeCalledWith('annotations_active_set', '123');
        });
    });

    describe('emitRemoveEvent', () => {
        test('should call annotator on delete with a delete event', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.handleAnnotator(mockAnnotator);
            instance.emitRemoveEvent('123');

            expect(mockAnnotator.emit).toBeCalledWith('annotations_remove', '123');
        });
    });

    describe('handleAnnotationCreate()', () => {
        const mockAnnotation = { foo: 'bar' };
        const mockError = new Error('boo');

        test.each`
            status            | annotation        | error        | expectedAction         | expectedAnnotation | expectedError
            ${Status.PENDING} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_START} | ${mockAnnotation}  | ${null}
            ${Status.SUCCESS} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${null}
            ${Status.ERROR}   | ${mockAnnotation} | ${mockError} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${mockError}
        `(
            'should update the context provider value if $status status received',
            ({ status, annotation, error, expectedAction, expectedAnnotation, expectedError }) => {
                const wrapper = getWrapper();
                const eventData = {
                    annotation,
                    meta: {
                        status,
                        requestId: '123',
                    },
                    error,
                };

                wrapper.instance().handleAnnotationCreate(eventData);
                const contextProvider = getContextProvider(wrapper);

                expect(contextProvider.exists()).toBeTruthy();
                expect(contextProvider.prop('value').state).toEqual({
                    action: expectedAction,
                    activeAnnotationFileVersionId: null,
                    activeAnnotationId: null,
                    annotation: expectedAnnotation,
                    error: expectedError,
                    meta: {
                        status,
                        requestId: '123',
                    },
                });
            },
        );

        test('should invoke the onError prop if provided', () => {
            const onError = jest.fn();
            const wrapper = getWrapper({ onError });

            wrapper.instance().handleAnnotationCreate({
                error: mockError,
                meta: {
                    requestId: '123',
                    status: Status.ERROR,
                },
            });

            expect(onError).toHaveBeenCalledWith(mockError, 'create_annotation_error', { showNotification: true });
        });
    });

    describe('handleActiveChange()', () => {
        test.each`
            annotationId | fileVersionId | expectedAnnotationId | expectedFileVersionId
            ${null}      | ${'456'}      | ${null}              | ${'456'}
            ${'123'}     | ${'456'}      | ${'123'}             | ${'456'}
        `(
            'should update activeAnnotationId state to reflect value $annotationId',
            ({ annotationId, fileVersionId, expectedAnnotationId, expectedFileVersionId }) => {
                const wrapper = getWrapper();

                wrapper.instance().handleActiveChange({ annotationId, fileVersionId });
                const contextProvider = getContextProvider(wrapper);
                const { activeAnnotationFileVersionId, activeAnnotationId } = contextProvider.prop('value').state;
                expect(contextProvider.exists()).toBeTruthy();
                expect(activeAnnotationFileVersionId).toEqual(expectedFileVersionId);
                expect(activeAnnotationId).toEqual(expectedAnnotationId);
            },
        );
    });

    describe('handleAnnotationFetchError()', () => {
        test('should call onError', () => {
            const instance = getWrapper().instance();

            const mockError = new Error();
            instance.handleAnnotationFetchError({ error: mockError });

            expect(defaults.onError).toHaveBeenCalledWith(mockError, 'fetch_annotations_error', {
                showNotification: true,
            });
        });
    });

    describe('handlePreviewDestroy()', () => {
        test('should reset state and annotator', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleAnnotator(mockAnnotator);
            wrapper.setState({ activeAnnotationId: '123', activeAnnotationFileVersionId: '456' });
            wrapper.instance().handlePreviewDestroy();

            expect(wrapper.state()).toEqual({
                action: null,
                activeAnnotationFileVersionId: null,
                activeAnnotationId: null,
                annotation: null,
                error: null,
                meta: null,
            });
        });

        test('should not reset state if called with false', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleAnnotator(mockAnnotator);
            wrapper.setState({ activeAnnotationId: '123', activeAnnotationFileVersionId: '456' });
            wrapper.instance().handlePreviewDestroy(false);

            expect(wrapper.state('activeAnnotationId')).toBe('123');
            expect(wrapper.state('activeAnnotationFileVersionId')).toBe('456');
        });

        test.each([true, false])('should remove all annotator event listeners', shouldReset => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.handleAnnotator(mockAnnotator);
            instance.handlePreviewDestroy(shouldReset);

            expect(mockAnnotator.removeListener).toBeCalledWith(
                'annotations_active_change',
                instance.handleActiveChange,
            );
            expect(mockAnnotator.removeListener).toBeCalledWith('annotations_create', instance.handleAnnotationCreate);
            expect(mockAnnotator.removeListener).toBeCalledWith(
                'annotations_fetch_error',
                instance.handleAnnotationFetchError,
            );
        });
    });

    describe('getAnnotationsPath()', () => {
        test.each`
            fileVersionId | annotationId | expectedPath
            ${undefined}  | ${undefined} | ${'/activity'}
            ${undefined}  | ${null}      | ${'/activity'}
            ${'123'}      | ${undefined} | ${'/activity/annotations/123'}
            ${'123'}      | ${null}      | ${'/activity/annotations/123'}
            ${'123'}      | ${'456'}     | ${'/activity/annotations/123/456'}
        `('should return $expectedPath', ({ fileVersionId, annotationId, expectedPath }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getAnnotationsPath(fileVersionId, annotationId)).toBe(expectedPath);
        });
    });
});
