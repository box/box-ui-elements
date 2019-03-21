import React from 'react';
import { shallow } from 'enzyme';
import { BackButton } from '..';

jest.mock('react-router-dom', () => ({
    withRouter: Component => Component,
}));

describe('elements/common/nav-button/BackButton', () => {
    const history = { goBack: jest.fn() };
    const getWrapper = () => shallow(<BackButton history={history} />);

    test('should match its snapshot', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should call history back on click', () => {
        const wrapper = getWrapper();

        wrapper.simulate('click');

        expect(history.goBack).toHaveBeenCalled();
    });
});
