import React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from '../ErrorBoundary';

describe('components/ErrorBoundary', () => {
    const WrappedComponent = () => <div>Test</div>;
    const wrappedError = new Error('ERROR');

    const getWrapper = props =>
        shallow(
            <ErrorBoundary {...props}>
                <WrappedComponent />
            </ErrorBoundary>,
        );
    const simulateError = wrapper => {
        wrapper.find(WrappedComponent).simulateError(wrappedError);
    };

    describe('should render', () => {
        test('the wrapped component when no error is thrown', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        test('nothing by default when an error is thrown', () => {
            const wrapper = getWrapper();

            simulateError(wrapper);

            expect(wrapper).toMatchSnapshot();
        });

        test('the component specified when an error is thrown', () => {
            const wrapper = getWrapper({
                component: <div>Error</div>,
            });

            simulateError(wrapper);

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('onError callback', () => {
        test('should be be called with any wrapped error', () => {
            const onError = jest.fn();
            const wrapper = getWrapper({
                onError,
            });

            simulateError(wrapper);

            expect(onError).toHaveBeenCalledWith(wrappedError);
        });
    });
});
