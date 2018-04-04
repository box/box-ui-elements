import React from 'react';
import { shallow } from 'enzyme';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import withErrorHandling from '../withErrorHandling';

describe('components/withErrorHandling', () => {
    const WrappedComponent = () => <div />;
    const WithErrorHandlingComponent = withErrorHandling(WrappedComponent);

    const getWrapper = (props) => shallow(<WithErrorHandlingComponent {...props} />);

    test('should render a ErrorMask', () => {
        const props = {
            maskError: {
                errorHeader: 'foo'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper.find(WrappedComponent).exists()).toBe(false);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a ErrorMask if both maskError and inlineError props passed', () => {
        const props = {
            maskError: {
                errorHeader: 'foo'
            },
            inlineError: {
                title: 'foo',
                content: 'bar'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper.find(InlineError).exists()).toBe(false);
        expect(wrapper.find(WrappedComponent).exists()).toBe(false);
    });

    test('should render an InlineError, along with the wrapped component', () => {
        const props = {
            inlineError: {
                title: 'foo',
                content: 'bar'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(ErrorMask).exists()).toBe(false);
        expect(wrapper.find(InlineError)).toHaveLength(1);
        expect(wrapper.find(WrappedComponent)).toHaveLength(1);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render the wrapped component', () => {
        const props = {};
        const wrapper = getWrapper(props);

        expect(wrapper.find(ErrorMask).exists()).toBe(false);
        expect(wrapper.find(InlineError).exists()).toBe(false);
        expect(wrapper.find(WrappedComponent)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
