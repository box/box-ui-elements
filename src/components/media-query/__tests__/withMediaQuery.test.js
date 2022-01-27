import React from 'react';
import { mount, shallow } from 'enzyme';
import withMediaQuery from '../withMediaQuery';

describe('elements/common/media-query/withMediaQuery', () => {
    const WrappedComponent = () => <div />;
    const WithMediaComponent = withMediaQuery(WrappedComponent);

    const getWrapper = props => shallow(<WithMediaComponent {...props} />);

    test('wraps component with media query props', () => {
        const container = mount(<WithMediaComponent />);

        const containerProps = container.find('WrappedComponent').props();

        expect(containerProps.size).not.toBeNull();
        expect(containerProps.pointer).not.toBeNull();
        expect(containerProps.anyPointer).not.toBeNull();
        expect(containerProps.hover).not.toBeNull();
        expect(containerProps.anyHover).not.toBeNull();
    });

    test('should render inner component', () => {
        const props = {};
        const wrapper = getWrapper(props);

        expect(wrapper.find(WrappedComponent)).toHaveLength(1);
    });
});
