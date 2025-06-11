import * as React from 'react';
import { render } from '@testing-library/react';
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

    type WrappedComponentProps = ComponentProps & WithAnnotatorContextProps;

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

        const MockComponent = jest.fn<JSX.Element | null, [WrappedComponentProps]>();
        const WrappedWithMockComponent = withAnnotatorContext(MockComponent);

        render(<WrappedWithMockComponent />);

        expect(MockComponent).toHaveBeenCalledTimes(1);
        const props = MockComponent.mock.calls[0][0];

        expect(props.annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
        expect(props.emitActiveAnnotationChangeEvent).toBe(mockEmitActiveAnnotationChangeEvent);
        expect(props.emitAnnotationRemoveEvent).toBe(mockEmitAnnotationRemoveEvent);
        expect(props.emitAnnotationReplyCreateEvent).toBe(mockEmitAnnotationReplyCreateEvent);
        expect(props.emitAnnotationReplyDeleteEvent).toBe(mockEmitAnnotationReplyDeleteEvent);
        expect(props.emitAnnotationReplyUpdateEvent).toBe(mockMmitAnnotationReplyUpdateEvent);
        expect(props.emitAnnotationUpdateEvent).toBe(mockEmitAnnotationUpdateEvent);
        expect(props.getAnnotationsMatchPath).toBe(mockGetAnnotationsMatchPath);
        expect(props.getAnnotationsPath).toBe(mockGetAnnotationsPath);
    });

    test('should apply the annotator context to the wrapped component without router props when routerDisabled is true', () => {
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

        const MockComponent = jest.fn<JSX.Element | null, [WrappedComponentProps]>(() => null);
        const WrappedWithMockComponent = withAnnotatorContext(MockComponent);

        render(<WrappedWithMockComponent routerDisabled={true} />);

        expect(MockComponent).toHaveBeenCalledTimes(1);
        const props = MockComponent.mock.calls[0][0];

        expect(props.annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
        expect(props.emitActiveAnnotationChangeEvent).toBe(mockEmitActiveAnnotationChangeEvent);
        expect(props.emitAnnotationRemoveEvent).toBe(mockEmitAnnotationRemoveEvent);
        expect(props.emitAnnotationReplyCreateEvent).toBe(mockEmitAnnotationReplyCreateEvent);
        expect(props.emitAnnotationReplyDeleteEvent).toBe(mockEmitAnnotationReplyDeleteEvent);
        expect(props.emitAnnotationReplyUpdateEvent).toBe(mockMmitAnnotationReplyUpdateEvent);
        expect(props.emitAnnotationUpdateEvent).toBe(mockEmitAnnotationUpdateEvent);

        // Router-related props should not be passed when routerDisabled is true
        expect(props.getAnnotationsMatchPath).toBeUndefined();
        expect(props.getAnnotationsPath).toBeUndefined();
    });

    test('should apply the annotator context to the wrapped component without router props when routerDisabled in feature flags is true', () => {
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

        const MockComponent = jest.fn<JSX.Element | null, [WrappedComponentProps]>(() => null);
        const WrappedWithMockComponent = withAnnotatorContext(MockComponent);

        render(<WrappedWithMockComponent features={{ routerDisabled: { value: true } }} />);

        expect(MockComponent).toHaveBeenCalledTimes(1);
        const props = MockComponent.mock.calls[0][0];

        expect(props.annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
        expect(props.emitActiveAnnotationChangeEvent).toBe(mockEmitActiveAnnotationChangeEvent);
        expect(props.emitAnnotationRemoveEvent).toBe(mockEmitAnnotationRemoveEvent);
        expect(props.emitAnnotationReplyCreateEvent).toBe(mockEmitAnnotationReplyCreateEvent);
        expect(props.emitAnnotationReplyDeleteEvent).toBe(mockEmitAnnotationReplyDeleteEvent);
        expect(props.emitAnnotationReplyUpdateEvent).toBe(mockMmitAnnotationReplyUpdateEvent);
        expect(props.emitAnnotationUpdateEvent).toBe(mockEmitAnnotationUpdateEvent);

        // Router-related props should not be passed when routerDisabled is true
        expect(props.getAnnotationsMatchPath).toBeUndefined();
        expect(props.getAnnotationsPath).toBeUndefined();
    });
});
