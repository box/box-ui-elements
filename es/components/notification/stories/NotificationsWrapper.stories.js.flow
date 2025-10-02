// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import Button from '../../button/Button';
import PrimaryButton from '../../primary-button/PrimaryButton';
import Notification from '../Notification';

import NotificationsWrapper from '../NotificationsWrapper';
import notes from './NotificationsWrapper.stories.md';

export const example = () => {
    const DATE = new Date('May 13, 2002 23:15:30').toTimeString();

    const [notificationData, setNotificationData] = React.useState({
        id: 0,
        notifications: new Map(),
    });

    const closeNotification = id => {
        const notifications = new Map(notificationData.notifications);
        notifications.delete(id);
        setNotificationData({ ...notificationData, notifications });
    };

    const addNotification = (duration, type) => {
        const { id } = notificationData;
        const { notifications } = notificationData;
        const notification = (
            <Notification key={id} duration={duration} onClose={() => closeNotification(id)} type={type}>
                <span>Hello world! I was made at {DATE}</span>
                <Button>Okay</Button>
            </Notification>
        );
        setNotificationData({
            notifications: notifications.set(id, notification),
            id: id + 1,
        });
    };

    return (
        <div>
            <NotificationsWrapper>{[...notificationData.notifications.values()]}</NotificationsWrapper>
            <Button onClick={() => addNotification('short', 'info')}>Display timed notification</Button>
            <PrimaryButton onClick={() => addNotification(undefined, 'warn')}>
                Display persistent notification
            </PrimaryButton>
        </div>
    );
};

export default {
    title: 'Components/Notifications/NotificationsWrapper',
    component: NotificationsWrapper,
    parameters: {
        notes,
    },
};
