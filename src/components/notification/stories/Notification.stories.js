// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import Button from '../../button/Button';

import Notification from '../Notification';
import notes from './Notification.stories.md';

export const basic = () => (
    <IntlProvider locale="en">
        <Notification>This is a default notification.</Notification>
    </IntlProvider>
);

export const info = () => (
    <IntlProvider locale="en">
        <Notification type="info">
            <span>This is an info notification with a button.</span>
            <Button>Click me</Button>
        </Notification>
    </IntlProvider>
);

export const warn = () => (
    <IntlProvider locale="en">
        <Notification type="warn">
            <span>This is a warning notification with two buttons.</span>
            <Button>Click me</Button>
            <Button>Click me again</Button>
        </Notification>
    </IntlProvider>
);

export const error = () => (
    <IntlProvider locale="en">
        <Notification type="error">
            <span>This is an error notification.</span>
        </Notification>
    </IntlProvider>
);

export const basicV2 = () => (
    <IntlProvider locale="en">
        <Notification useV2Icons>This is a default notification.</Notification>
    </IntlProvider>
);

export const infoV2 = () => (
    <IntlProvider locale="en">
        <Notification type="info" useV2Icons>
            <span>This is an info notification with a button.</span>
            <Button>Click me</Button>
        </Notification>
    </IntlProvider>
);

export const warnV2 = () => (
    <IntlProvider locale="en">
        <Notification type="warn" useV2Icons>
            <span>This is a warning notification with two buttons.</span>
            <Button>Click me</Button>
            <Button>Click me again</Button>
        </Notification>
    </IntlProvider>
);

export const errorV2 = () => (
    <IntlProvider locale="en">
        <Notification type="error" useV2Icons>
            <span>This is an error notification.</span>
        </Notification>
    </IntlProvider>
);

export default {
    title: 'Components/Notifications/Notification',
    component: Notification,
    parameters: {
        notes,
    },
};
