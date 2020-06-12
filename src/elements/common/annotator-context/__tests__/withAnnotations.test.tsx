import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { createMemoryHistory, History, Location } from 'history';

import { Annotator, AnnotatorContext, withAnnotations } from '../index';
import { WithAnnotationsProps, ComponentWithAnnotations } from '../withAnnotations';
import { AnnotatorContext as AnnotatorContextType, Action } from '../types';

type ComponentProps = {
    className?: string;
    history?: History;
    location?: Location;
};

type WrappedComponentProps = ComponentProps & Partial<WithAnnotationsProps>;

type ContextProviderProps = {
    value: AnnotatorContextType;
};

describe('elements/common/annotator-context/withAnnotations', () => {
    let mockAnnotator = {} as Annotator;
    const MockComponent = (props: ComponentProps) => <div {...props} />;
    const WrappedComponent = withAnnotations(MockComponent);

    const defaultProps = {
        className: 'foo',
        onAnnotator: jest.fn(),
        onPreviewDestroy: jest.fn(),
    };

    const getWrapper = (
        props: WrappedComponentProps = defaultProps,
    ): ShallowWrapper<WrappedComponentProps, {}, Component & ComponentWithAnnotations> =>
        shallow<Component & ComponentWithAnnotations, WrappedComponentProps>(
            <WrappedComponent {...defaultProps} {...props} />,
        );

    const getContextProvider = (
        wrapper: ShallowWrapper<WrappedComponentProps, {}, Component & ComponentWithAnnotations>,
    ) => wrapper.find<ContextProviderProps>(AnnotatorContext.Provider);

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

        const wrappedComponent = wrapper.find<WrappedComponentProps>(MockComponent);
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
            status       | annotation        | error        | expectedAction         | expectedAnnotation | expectedError
            ${'pending'} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_START} | ${mockAnnotation}  | ${null}
            ${'success'} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${null}
            ${'error'}   | ${mockAnnotation} | ${mockError} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${mockError}
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
    });

    describe('handleActiveChange()', () => {
        test.each`
            annotationId | expected
            ${null}      | ${null}
            ${'123'}     | ${'123'}
        `('should update activeAnnotationId state to reflect value $annotationId', ({ annotationId, expected }) => {
            const wrapper = getWrapper();

            wrapper.instance().handleActiveChange(annotationId);
            const contextProvider = getContextProvider(wrapper);
            expect(contextProvider.exists()).toBeTruthy();
            expect(contextProvider.prop('value').state.activeAnnotationId).toEqual(expected);
        });
    });

    describe('handleAnnotatorEvent()', () => {
        test.each`
            event                          | numCreateCalled | numActiveChangeCalled
            ${'annotations_create'}        | ${1}            | ${0}
            ${'annotations_active_change'} | ${0}            | ${1}
            ${'foo'}                       | ${0}            | ${0}
        `(
            'should call appropriate handler based on event $event',
            ({ event, numCreateCalled, numActiveChangeCalled }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                instance.handleAnnotationCreate = jest.fn();
                instance.handleActiveChange = jest.fn();

                instance.handleAnnotatorEvent({ event });

                expect((instance.handleAnnotationCreate as jest.Mock).mock.calls.length).toBe(numCreateCalled);
                expect((instance.handleActiveChange as jest.Mock).mock.calls.length).toBe(numActiveChangeCalled);
            },
        );
    });

    describe('handlePreviewDestroy()', () => {
        test('should reset state and annotator', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleAnnotator(mockAnnotator);

            wrapper.instance().handlePreviewDestroy();
            expect(mockAnnotator.removeListener).toBeCalledWith('annotatorevent', instance.handleAnnotatorEvent);
            expect(wrapper.state()).toEqual({
                action: null,
                activeAnnotationId: null,
                annotation: null,
                error: null,
                meta: null,
            });
        });

        test('should not reset state if called with false', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleAnnotator(mockAnnotator);

            wrapper.setState({ activeAnnotationId: '123' });
            wrapper.instance().handlePreviewDestroy(false);
            expect(mockAnnotator.removeListener).toBeCalledWith('annotatorevent', instance.handleAnnotatorEvent);
            expect(wrapper.state('activeAnnotationId')).toBe('123');
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
