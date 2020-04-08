import React from 'react';
import { shallow } from 'enzyme';
import { withAnnotatorContext, WithAnnotatorContextProps } from '../index';
import { Action } from '../types';

const mockContext = jest.fn();
jest.mock('../AnnotatorContext', () => ({
    Consumer: ({ children }: { children: Function }) => children(mockContext()),
}));

describe('elements/common/annotator-context/withAnnotatorContext', () => {
    type ComponentProps = {
        className?: string | undefined;
    };

    type WrappedComponentProps<T> = ComponentProps & WithAnnotatorContextProps;

    const Component = (props: WrappedComponentProps<HTMLDivElement>) => <div {...props} />;

    const WrappedComponent = withAnnotatorContext(Component);

    const getWrapper = (props?: WrappedComponentProps<HTMLDivElement>) => shallow(<WrappedComponent {...props} />);

    beforeEach(() => jest.resetAllMocks());

    test('should apply the annotator context to the wrapped component as a prop', () => {
        const annotatorState = {
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        };

        mockContext.mockReturnValue(annotatorState);

        const wrapper = getWrapper();
        const wrappedComponent = wrapper.dive().find(Component);
        expect(wrappedComponent.exists()).toBeTruthy();
        expect((wrappedComponent.props() as WrappedComponentProps<HTMLDivElement>).annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
    });
});
