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
        const mockGetAnnotationsMatchPath = jest.fn();
        const mockGetAnnotationsPath = jest.fn();
        const mockPublishActiveAnnotationChangeInSidebar = jest.fn();
        const mockPublishAnnotationUpdateEnd = jest.fn();
        const mockPublishAnnotationUpdateStart = jest.fn();
        const mockPublishAnnotationDeleteEnd = jest.fn();
        const mockPublishAnnotationDeleteStart = jest.fn();

        mockContext.mockReturnValue({
            getAnnotationsMatchPath: mockGetAnnotationsMatchPath,
            getAnnotationsPath: mockGetAnnotationsPath,
            publishActiveAnnotationChangeInSidebar: mockPublishActiveAnnotationChangeInSidebar,
            publishAnnotationUpdateEnd: mockPublishAnnotationUpdateEnd,
            publishAnnotationUpdateStart: mockPublishAnnotationUpdateStart,
            publishAnnotationDeleteEnd: mockPublishAnnotationDeleteEnd,
            publishAnnotationDeleteStart: mockPublishAnnotationDeleteStart,
            state: annotatorState,
        });

        const wrapper = getWrapper();
        const wrappedComponent = wrapper.dive().find(Component);
        const props = wrappedComponent.props() as WrappedComponentProps<HTMLDivElement>;

        expect(wrappedComponent.exists()).toBeTruthy();
        expect(props.annotatorState).toEqual({
            annotation: { foo: 'bar' },
            action: Action.CREATE_START,
        });
        expect(props.getAnnotationsMatchPath).toEqual(mockGetAnnotationsMatchPath);
        expect(props.getAnnotationsPath).toEqual(mockGetAnnotationsPath);
        expect(props.publishActiveAnnotationChangeInSidebar).toEqual(mockPublishActiveAnnotationChangeInSidebar);
        expect(props.publishAnnotationUpdateEnd).toEqual(mockPublishAnnotationUpdateEnd);
        expect(props.publishAnnotationUpdateStart).toEqual(mockPublishAnnotationUpdateStart);
        expect(props.publishAnnotationDeleteEnd).toEqual(mockPublishAnnotationDeleteEnd);
        expect(props.publishAnnotationDeleteStart).toEqual(mockPublishAnnotationDeleteStart);
    });
});
