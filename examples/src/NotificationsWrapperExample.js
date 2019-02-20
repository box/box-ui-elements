import React, { Component } from 'react';

import Button from '../../src/components/button';
import PrimaryButton from '../../src/components/primary-button';
import { Notification, NotificationsWrapper } from '../../src/components/notification';

class NotificationsWrapperExample extends Component {
    state = {
        id: 0,
        notifications: new Map(),
    };

    closeNotification = id => {
        const { notifications } = this.state;

        notifications.delete(id);
        this.setState({ notifications });
    };

    addNotification = duration => {
        const { id, notifications } = this.state;

        const type = [undefined, 'info', 'warn', 'error'][id % 4];
        const notification = (
            <Notification key={id} duration={duration} onClose={() => this.closeNotification(id)} type={type}>
                <span>Hello world! I was made at {new Date().toTimeString()}</span>
                <Button>Okay</Button>
            </Notification>
        );

        this.setState({
            notifications: notifications.set(id, notification),
            id: id + 1,
        });
    };

    render() {
        const { notifications } = this.state;

        return (
            <div>
                <NotificationsWrapper>{[...notifications.values()]}</NotificationsWrapper>
                <Button onClick={() => this.addNotification('short')}>Display timed notification</Button>
                <PrimaryButton onClick={() => this.addNotification()}>Display persistent notification</PrimaryButton>
            </div>
        );
    }
}

NotificationsWrapperExample.displayName = 'NotificationsWrapperExample';

export default NotificationsWrapperExample;
