import * as React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import CustomRouter from '../../routing/customRouter';
import { BackButton } from '..';

describe('elements/common/nav-button/BackButton', () => {
    const getMockHistory = (initialEntries = ['/start', '/test']) => {
        const history = createMemoryHistory({ initialEntries });
        jest.spyOn(history, 'goBack');
        jest.spyOn(history, 'push');
        return history;
    };

    const getWrapper = (props = {}, history = getMockHistory()) =>
        mount(
            <CustomRouter history={history}>
                <BackButton {...props} />
            </CustomRouter>,
        );

    test('should match its snapshot', () => {
        const wrapper = getWrapper();
        const button = wrapper.find(BackButton).first();

        expect(button).toMatchSnapshot();
    });

    test('should call history back on click if no path is defined', () => {
        const history = getMockHistory();
        const wrapper = getWrapper({}, history);

        wrapper.find('button').simulate('click');

        expect(history.goBack).toHaveBeenCalled();
    });

    test('should call history.push on click if a path is defined', () => {
        const history = getMockHistory();
        const wrapper = getWrapper({ to: '/new' }, history);

        wrapper.find('button').simulate('click');

        expect(history.push).toHaveBeenCalledWith('/new');
    });
});
