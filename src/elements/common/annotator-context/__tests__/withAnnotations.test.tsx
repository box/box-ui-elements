import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { AnnotatorContext, withAnnotations } from '../index';
import { WithAnnotationsComponent, WithAnnotationsProps, ComponentWithAnnotations } from '../withAnnotations';
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

    const defaultProps = { className: 'foo', onAnnotatorEvent: jest.fn() };

    const getWrapper = (props: WrappedComponentProps = defaultProps) =>
        shallow<WithAnnotationsComponent<WrappedComponentProps>>(<WrappedComponent {...props} />);

    const getContextProvider = (wrapper: ShallowWrapper<WithAnnotationsComponent<WrappedComponentProps>>) =>
        wrapper.find(AnnotatorContext.Provider);

    test('should pass onAnnotatorEvent as a prop on the wrapped component', () => {
        const wrapper = getWrapper();

        const wrappedComponent = wrapper.find(MockComponent);
        expect(wrappedComponent.exists()).toBeTruthy();
        expect((wrappedComponent.props() as WrappedComponentProps).onAnnotatorEvent).toBeTruthy();
    });

    test('should pass the state on to the AnnotatorContext.Provider', () => {
        const wrapper = getWrapper();

        const contextProvider = getContextProvider(wrapper);
        expect(contextProvider.exists()).toBeTruthy();
        expect((contextProvider.props() as ContextProviderProps).value).toEqual({
            activeAnnotationId: null,
            annotation: undefined,
            action: undefined,
            error: undefined,
        });
    });

    describe('handleAnnotationCreate()', () => {
        const mockAnnotation = { foo: 'bar' };
        const mockError = new Error('boo');

        test.each`
            status       | annotation        | error        | expectedAction         | expectedAnnotation | expectedError
            ${'pending'} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_START} | ${mockAnnotation}  | ${undefined}
            ${'success'} | ${mockAnnotation} | ${undefined} | ${Action.CREATE_END}   | ${mockAnnotation}  | ${undefined}
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

                (wrapper.instance() as Component & ComponentWithAnnotations).handleAnnotationCreate(eventData);
                const contextProvider = getContextProvider(wrapper);
                expect(contextProvider.exists()).toBeTruthy();
                expect((contextProvider.props() as ContextProviderProps).value).toEqual({
                    activeAnnotationId: null,
                    annotation: expectedAnnotation,
                    action: expectedAction,
                    error: expectedError,
                });
            },
        );
    });
});
