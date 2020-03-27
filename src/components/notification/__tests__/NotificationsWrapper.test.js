import React from 'react';

import NotificationsWrapper from '../NotificationsWrapper';
import Notification from '../Notification';

describe('components/notification/NotificationsWrapper', () => {
    test('should render a Portal with the notifications-wrapper class', () => {
        const wrapper = shallow(<NotificationsWrapper />);
        expect(wrapper.is('Portal')).toBeTruthy();
        expect(wrapper.hasClass('notifications-wrapper')).toBeTruthy();
        expect(wrapper.props('aria-live')).toBeTruthy();
    });

    test('should render a focus trap', () => {
        const wrapper = shallow(
            <NotificationsWrapper>
                <Notification>test1</Notification>
            </NotificationsWrapper>,
        );
        const focusTrap = wrapper.find('FocusTrap');
        expect(focusTrap.length).toEqual(1);
    });

    test('should not render focusTrap if there are no children', () => {
        const wrapper = shallow(<NotificationsWrapper />);
        expect(wrapper.exists('FocusTrap')).toBe(false);
    });

    test('should render child notifications when passed in children', () => {
        const wrapper = shallow(
            <NotificationsWrapper>
                <Notification>test1</Notification>
                <Notification>test2</Notification>
            </NotificationsWrapper>,
        );

        expect(wrapper.find('Notification').length).toEqual(2);
    });
});
