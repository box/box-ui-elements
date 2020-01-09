import * as React from 'react';
import { shallow } from 'enzyme';
import AsyncError from '../AsyncError';

describe('elements/common/async-load/AsyncError', () => {
    const Component = () => <div>ERROR!</div>;
    const getWrapper = ({ children = 'Test!', component = Component, ...rest }) =>
        shallow(
            <AsyncError component={component} {...rest}>
                {children}
            </AsyncError>,
        );

    test('should render the children components if there is no error', () => {
        const wrapper = getWrapper({ component: Component });

        expect(wrapper.exists(Component)).toBe(false);
        expect(wrapper.text()).toBe('Test!');
        expect(wrapper).toMatchSnapshot();
    });

    test('should render the error component if there is an error', () => {
        const wrapper = getWrapper({ component: Component });

        wrapper.setState({
            error: new Error('foo'),
        });

        expect(wrapper.exists(Component)).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });
});
