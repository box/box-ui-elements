import * as React from 'react';
import { shallow } from 'enzyme';
import { retryNumOfTimes } from '../../../../utils/function';
import AsyncLoad from '../AsyncLoad';

jest.mock('../../../../utils/function', () => ({
    retryNumOfTimes: jest.fn(),
}));

describe('elements/common/async-load/AsyncLoad', () => {
    const getAsyncComponent = (props = { loader: jest.fn() }) => AsyncLoad(props);
    const getWrapper = (AsyncComponent, props) => shallow(<AsyncComponent {...props} />).dive();

    test('should load the lazy component', () => {
        const AsyncComponent = getAsyncComponent();
        const wrapper = getWrapper(AsyncComponent, { foo: 'bar' });
        expect(wrapper).toMatchSnapshot();
    });

    test('should not invoke the loader until component mounted', () => {
        expect(retryNumOfTimes).not.toHaveBeenCalled();
    });
});
