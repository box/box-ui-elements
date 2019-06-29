import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { BackButton } from '..';

describe('elements/common/nav-button/BackButton', () => {
    const getWrapper = (props = {}) =>
        mount(
            <MemoryRouter initialEntries={['/start', '/test']}>
                <BackButton {...props} />
            </MemoryRouter>,
        );
    const getHistory = wrapper => wrapper.find(Router).prop('history');

    test('should match its snapshot', () => {
        const wrapper = getWrapper();
        const button = wrapper.find(BackButton).first();

        expect(button).toMatchSnapshot();
    });

    test('should call history back on click if no path is defined', () => {
        const wrapper = getWrapper();
        const history = getHistory(wrapper);

        history.goBack = jest.fn();

        wrapper.simulate('click');

        expect(history.goBack).toHaveBeenCalled();
    });

    test('should call history.push on click if a path is defined', () => {
        const wrapper = getWrapper({ to: '/new' });
        const history = getHistory(wrapper);

        history.push = jest.fn();

        wrapper.simulate('click');

        expect(history.push).toHaveBeenCalledWith('/new');
    });
});
