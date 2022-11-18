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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type WrappedComponentProps<T> = ComponentProps & WithAnnotatorContextProps; // T is supposed to be allowed component props

    const Component = (props: WrappedComponentProps<HTMLDivElement>) => <div {...props} />;

    const WrappedComponent = withAnnotatorContext(Component);

    const getWrapper = (props?: WrappedComponentProps<HTMLDivElement>) => shallow(<WrappedComponent {...props} />);

    beforeEach(() => jest.resetAllMocks());

    test('should apply the annotator context to the wrapped component as a prop', () => {
        const annotatorState = {
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        };
        const mockEmitActiveAnnotationChangeEvent = jest.fn();
        const mockEmitAnnotationRemoveEvent = jest.fn();
        const mockEmitAnnotationReplyCreateEvent = jest.fn();
        const mockEmitAnnotationReplyDeleteEvent = jest.fn();
        const mockMmitAnnotationReplyUpdateEvent = jest.fn();
        const mockEmitAnnotationUpdateEvent = jest.fn();
        const mockGetAnnotationsMatchPath = jest.fn();
        const mockGetAnnotationsPath = jest.fn();

        mockContext.mockReturnValue({
            state: annotatorState,
            emitActiveAnnotationChangeEvent: mockEmitActiveAnnotationChangeEvent,
            emitAnnotationRemoveEvent: mockEmitAnnotationRemoveEvent,
            emitAnnotationReplyCreateEvent: mockEmitAnnotationReplyCreateEvent,
            emitAnnotationReplyDeleteEvent: mockEmitAnnotationReplyDeleteEvent,
            emitAnnotationReplyUpdateEvent: mockMmitAnnotationReplyUpdateEvent,
            emitAnnotationUpdateEvent: mockEmitAnnotationUpdateEvent,
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
        expect(props.emitActiveAnnotationChangeEvent).toEqual(mockEmitActiveAnnotationChangeEvent);
        expect(props.emitAnnotationRemoveEvent).toEqual(mockEmitAnnotationRemoveEvent);
        expect(props.emitAnnotationReplyCreateEvent).toEqual(mockEmitAnnotationReplyCreateEvent);
        expect(props.emitAnnotationReplyDeleteEvent).toEqual(mockEmitAnnotationReplyDeleteEvent);
        expect(props.emitAnnotationReplyUpdateEvent).toEqual(mockMmitAnnotationReplyUpdateEvent);
        expect(props.emitAnnotationUpdateEvent).toEqual(mockEmitAnnotationUpdateEvent);
        expect(props.getAnnotationsMatchPath).toEqual(mockGetAnnotationsMatchPath);
        expect(props.getAnnotationsPath).toEqual(mockGetAnnotationsPath);
    });
});
