import React from 'react';

import NotificationsWrapper from '../NotificationsWrapper';
import Notification from '../Notification';

describe('components/notification/NotificationsWrapper', () => {
    test('should render a Portal with the notifications-wrapper class', () => {
        const wrapper = shallow(<NotificationsWrapper />);
        expect(wrapper.is('Portal')).toBeTruthy();
        expect(wrapper.hasClass('notifications-wrapper')).toBeTruthy();
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
