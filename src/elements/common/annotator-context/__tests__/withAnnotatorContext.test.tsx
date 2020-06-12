import React from 'react';
import { shallow } from 'enzyme';
import withAnnotatorContext, { WithAnnotatorContextProps } from '../withAnnotatorContext';
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
        const mockEmitAnnotatorChangeEvent = jest.fn();
        const mockEmitRemoveEvent = jest.fn();
        const mockGetAnnotationsMatchPath = jest.fn();
        const mockGetAnnotationsPath = jest.fn();

        mockContext.mockReturnValue({
            state: annotatorState,
            emitActiveChangeEvent: mockEmitAnnotatorChangeEvent,
            emitRemoveEvent: mockEmitRemoveEvent,
            getAnnotationsMatchPath: mockGetAnnotationsMatchPath,
            getAnnotationsPath: mockGetAnnotationsPath,
        });

        const wrapper = getWrapper();
        const wrappedComponent = wrapper.dive().find(Component);
        const props = wrappedComponent.props() as WrappedComponentProps<HTMLDivElement>;

        expect(wrappedComponent.exists()).toBeTruthy();
        expect(props.annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
        expect(props.emitAnnotatorActiveChangeEvent).toEqual(mockEmitAnnotatorChangeEvent);
        expect(props.emitRemoveEvent).toEqual(mockEmitRemoveEvent);
        expect(props.getAnnotationsMatchPath).toEqual(mockGetAnnotationsMatchPath);
        expect(props.getAnnotationsPath).toEqual(mockGetAnnotationsPath);
    });
});
