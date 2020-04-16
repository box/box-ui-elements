import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { AnnotatorContext, withAnnotations } from '../index';
import { WithAnnotationsProps, ComponentWithAnnotations } from '../withAnnotations';
import { AnnotatorState, Action } from '../types';

type ComponentProps = {
    className: string;
};

type WrappedComponentProps = ComponentProps & WithAnnotationsProps;

type ContextProviderProps = {
    value: AnnotatorState;
};

describe('elements/common/annotator-context/withAnnotations', () => {
    const MockComponent = (props: ComponentProps) => <div {...props} />;

    const WrappedComponent = withAnnotations(MockComponent);

    const defaultProps = { className: 'foo', onAnnotatorEvent: jest.fn(), onPreviewDestroy: jest.fn() };

    const getWrapper = (
        props: WrappedComponentProps = defaultProps,
    ): ShallowWrapper<WrappedComponentProps, {}, Component & ComponentWithAnnotations> =>
        shallow<Component & ComponentWithAnnotations, WrappedComponentProps>(<WrappedComponent {...props} />);

    const getContextProvider = (
        wrapper: ShallowWrapper<WrappedComponentProps, {}, Component & ComponentWithAnnotations>,
    ) => wrapper.find<ContextProviderProps>(AnnotatorContext.Provider);

    test('should pass onAnnotatorEvent and onPreviewDestroy as props on the wrapped component', () => {
        const wrapper = getWrapper();

        const wrappedComponent = wrapper.find<WrappedComponentProps>(MockComponent);
        expect(wrappedComponent.exists()).toBeTruthy();
        expect(wrappedComponent.props().onAnnotatorEvent).toBeTruthy();
        expect(wrappedComponent.props().onPreviewDestroy).toBeTruthy();
    });

    test('should pass the state on to the AnnotatorContext.Provider', () => {
        const wrapper = getWrapper();

        const contextProvider = getContextProvider(wrapper);
        expect(contextProvider.exists()).toBeTruthy();
        expect(contextProvider.prop('value')).toEqual({
            action: null,
            activeAnnotationId: null,
            annotation: null,
            error: null,
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
                    },
                    error,
                };

                wrapper.instance().handleAnnotationCreate(eventData);
                const contextProvider = getContextProvider(wrapper);
                expect(contextProvider.exists()).toBeTruthy();
                expect(contextProvider.prop('value')).toEqual({
                    action: expectedAction,
                    activeAnnotationId: null,
                    annotation: expectedAnnotation,
                    error: expectedError,
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
            expect(contextProvider.prop('value').activeAnnotationId).toEqual(expected);
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
        test('should reset state', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleActiveChange('123');
            let contextProvider = getContextProvider(wrapper);
            expect(contextProvider.prop('value').activeAnnotationId).toEqual('123');

            wrapper.instance().handlePreviewDestroy();
            contextProvider = getContextProvider(wrapper);
            expect(contextProvider.prop('value').activeAnnotationId).toEqual(null);
        });
    });
});
