import React from 'react';
import { shallow } from 'enzyme';
import withLogger from '../withLogger';

describe('elements/common/logger/withLogger', () => {
    const ORIGIN = 'foo';
    const WrappedComponent = () => <div />;

    const WithLoggerComponent = withLogger(ORIGIN)(WrappedComponent);

    const getWrapper = props => shallow(<WithLoggerComponent {...props} />);

    test('should wrap the provided component with an ErrorBoundary and pass the origin as a prop', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('Logger').exists()).toBeTruthy();
    });
});
