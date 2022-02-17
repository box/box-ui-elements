import React from 'react';
import { shallow } from 'enzyme';
import withViewportSize from '../withViewportSize';

import { useViewportSize, VIEWPORT_SIZE_DEFAULT_DEBOUNCE } from '../useViewportSize';

jest.mock('../useViewportSize', () => ({
    useViewportSize: jest.fn(() => {
        return { viewWidth: 1200, viewHeight: 800 };
    }),
    VIEWPORT_SIZE_DEFAULT_DEBOUNCE: 200,
}));

describe('elements/common/media-query/withViewportSize', () => {
    const WrappedComponent = () => <div />;
    const WithViewportSizeComponent = withViewportSize(WrappedComponent);

    const getWrapper = props => shallow(<WithViewportSizeComponent {...props} />);

    test('wraps component with viewport props', () => {
        const wrapper = getWrapper();
        const wrappedComponent = wrapper.find(WrappedComponent);
        const props = wrappedComponent.props();

        expect(wrappedComponent.exists()).toBeTruthy();

        expect(typeof props.viewWidth).toBe('number');
        expect(typeof props.viewHeight).toBe('number');
    });

    test('should render inner component', () => {
        const props = {};
        const wrapper = getWrapper(props);

        expect(wrapper.find(WrappedComponent)).toHaveLength(1);
    });

    test('should use default debounce value when no debounce value is provided', () => {
        const props = {};
        getWrapper(props);
        expect(useViewportSize).toBeCalledWith(VIEWPORT_SIZE_DEFAULT_DEBOUNCE);
    });

    test('should set debounce value when debounce value is provided', () => {
        const props = { debounce: VIEWPORT_SIZE_DEFAULT_DEBOUNCE + 10 };
        getWrapper(props);
        expect(useViewportSize).toBeCalledWith(VIEWPORT_SIZE_DEFAULT_DEBOUNCE + 10);
    });
});
