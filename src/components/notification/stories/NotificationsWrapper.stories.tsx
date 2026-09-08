/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import Button from '../../button/Button';
import PrimaryButton from '../../primary-button/PrimaryButton';
import Notification from '../Notification';

import { DURATION_SHORT, DURATION_LONG, TYPE_INFO, TYPE_WARN } from '../../../components/notification/constants';
import NotificationsWrapper from '../NotificationsWrapper';
import notes from './NotificationsWrapper.stories.md';

export const example = () => {
    const DATE = new Date('May 13, 2002 23:15:30').toTimeString();

    const [notificationData, setNotificationData] = React.useState<{
        id: number;
        notifications: Map<number, React.ReactNode>;
    }>({
        id: 0,
        notifications: new Map(),
    });

    const closeNotification = (id: number) => {
        const notifications = new Map(notificationData.notifications);
        notifications.delete(id);
        setNotificationData({ ...notificationData, notifications });
    };

    const addNotification = (
        duration: typeof DURATION_SHORT | typeof DURATION_LONG,
        type: typeof TYPE_INFO | typeof TYPE_WARN,
    ) => {
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
            <NotificationsWrapper>{Array.from(notificationData.notifications.values())}</NotificationsWrapper>
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
