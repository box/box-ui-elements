import * as React from 'react';
import { shallow } from 'enzyme';
import { retryNumOfTimes } from 'utils/function';
import AsyncLoad from '../AsyncLoad';

jest.mock('utils/function', () => ({
    retryNumOfTimes: jest.fn(),
}));

describe('elements/common/async-load/AsyncLoad', () => {
    let defaultProps;

    const getAsyncComponent = (props = defaultProps) => AsyncLoad(props);

    beforeEach(() => {
        defaultProps = {
            loader: jest.fn(),
        };
    });

    test('should return a react component', () => {
        const AsyncComponent = getAsyncComponent();
        expect(AsyncComponent.prototype).toBeInstanceOf(React.Component);
    });

    test('should load the lazy component', () => {
        const AsyncComponent = getAsyncComponent();
        const wrapper = shallow(<AsyncComponent foo="bar" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render the error component if there is an error', () => {
        const errorComponent = () => <div>ERROR!!</div>;
        const AsyncComponent = getAsyncComponent({
            ...defaultProps,
            errorComponent,
        });

        const wrapper = shallow(<AsyncComponent />);
        wrapper.setState({
            error: new Error('foo'),
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not invoke the loader until component mounted', () => {
        const AsyncComponent = getAsyncComponent();
        expect(retryNumOfTimes).not.toHaveBeenCalled();
    });
});
