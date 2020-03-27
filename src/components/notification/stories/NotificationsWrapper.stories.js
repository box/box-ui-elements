// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import Button from '../../button/Button';
import PrimaryButton from '../../primary-button/PrimaryButton';
import Notification from '../Notification';

import NotificationsWrapper from '../NotificationsWrapper';
import notes from './NotificationsWrapper.stories.md';

export const example = () => {
    const DATE = new Date('May 13, 2002 23:15:30').toTimeString();
    const componentStore = new Store({
        id: 0,
        notifications: new Map(),
    });

    const closeNotification = id => {
        const notifications = componentStore.get('notifications');
        notifications.delete(id);
        componentStore.set({ notifications });
    };

    const addNotification = (duration, type) => {
        const id = componentStore.get('id');
        const notifications = componentStore.get('notifications');
        const notification = (
            <Notification key={id} duration={duration} onClose={() => closeNotification(id)} type={type}>
                <span>Hello world! I was made at {DATE}</span>
                <Button>Okay</Button>
            </Notification>
        );

        componentStore.set({
            notifications: notifications.set(id, notification),
            id: id + 1,
        });
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        <NotificationsWrapper>{[...state.notifications.values()]}</NotificationsWrapper>
                        <Button onClick={() => addNotification('short', 'info')}>Display timed notification</Button>
                        <PrimaryButton onClick={() => addNotification(undefined, 'warn')}>
                            Display persistent notification
                        </PrimaryButton>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Components|Notifications/NotificationsWrapper',
    component: NotificationsWrapper,
    parameters: {
        notes,
    },
};
