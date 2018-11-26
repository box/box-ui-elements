import React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from '../ErrorBoundary';
import { ERROR_CODE_UNEXPECTED_EXCEPTION } from '../../../constants';

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
        const origin = 'some_component';

        test('should call the onError prop', () => {
            const onError = jest.fn();
            const wrapper = getWrapper({
                onError,
                errorOrigin: origin,
            });

            simulateError(wrapper);

            expect(onError).toHaveBeenCalledWith({
                type: 'error',
                code: ERROR_CODE_UNEXPECTED_EXCEPTION,
                message: wrappedError.message,
                origin,
                context_info: expect.objectContaining({
                    isErrorDisplayed: true,
                }),
            });
        });
    });
});
