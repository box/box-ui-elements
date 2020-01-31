import * as React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from '../ErrorBoundary';
import withErrorBoundary from '../withErrorBoundary';

describe('elements/withErrorBoundary', () => {
    const WrappedComponent = () => <div>Test</div>;
    const origin = 'foo';
    const WithErrorBoundaryComponent = withErrorBoundary(origin)(WrappedComponent);

    const getWrapper = props => shallow(<WithErrorBoundaryComponent {...props} />);

    test('should wrap the provided component with an ErrorBoundary and pass the origin as a prop', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(ErrorBoundary).exists()).toBeTruthy();
    });
});
