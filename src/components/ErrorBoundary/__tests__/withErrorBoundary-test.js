import * as React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from '../ErrorBoundary';
import withErrorBoundary from '../withErrorBoundary';

describe('components/withErrorBoundary', () => {
    const WrappedComponent = () => <div>Test</div>;
    const WithErrorBoundaryComponent = withErrorBoundary(WrappedComponent);

    const getWrapper = props => shallow(<WithErrorBoundaryComponent {...props} />);

    test('should wrap the provided component with an ErrorBoundary', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(ErrorBoundary).exists()).toBeTruthy();
    });
});
