import * as React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import type { WrappedComponentProps } from 'react-intl';
import classNames from 'classnames';

import {
    AlertCircle,
    InformationCircle,
    CheckmarkCircle,
    AlertTriangle,
    XMark,
} from '@box/blueprint-web-assets/icons/Medium';

import InfoBadge16 from '../../icon/line/InfoBadge16';
import CircleCheck16 from '../../icon/line/CircleCheck16';
import TriangleAlert16 from '../../icon/line/TriangleAlert16';

import XBadge16 from '../../icon/line/XBadge16';
import X16 from '../../icon/fill/X16';

import type { NotificationType } from '../../common/types/core';

import './Notification.scss';

// @NOTE: We can't import these constants from ./constant.js because `react-docgen`
// can't handle imported variables appear in propTypes
// see https://github.com/reactjs/react-docgen/issues/33
const DURATION_SHORT = 'short';
const DURATION_LONG = 'long';
const OVERFLOW_WRAP = 'wrap';
const TYPE_DEFAULT = 'default';
const TYPE_INFO = 'info';
const TYPE_WARN = 'warn';
const TYPE_ERROR = 'error';

const DURATION_TIMES = {
    [DURATION_SHORT]: 5000,
    [DURATION_LONG]: 10000,
};

const ICON_RENDERER: Record<NotificationType, (useV2Icons?: boolean) => React.ReactElement> = {
    [TYPE_DEFAULT]: useV2Icons => (useV2Icons ? <InformationCircle /> : <InfoBadge16 />),
    [TYPE_ERROR]: useV2Icons => (useV2Icons ? <AlertCircle /> : <XBadge16 />),
    [TYPE_INFO]: useV2Icons => (useV2Icons ? <CheckmarkCircle /> : <CircleCheck16 />),
    [TYPE_WARN]: useV2Icons => (useV2Icons ? <AlertTriangle /> : <TriangleAlert16 />),
};

const messages = defineMessages({
    clearNotificationButtonText: {
        defaultMessage: 'Clear Notification',
        description: 'Button to clear notification',
        id: 'boxui.notification.clearNotification',
    },
});

export interface NotificationProps {
    /**
     * The contents of the `Notification`.
     * - Notification text must be wrapped in a `<span />` tag.
     * - Notification buttons must be the `<Button />` component.
     */
    children: React.ReactNode;
    /** Additional CSS class for the notification */
    className?: string;
    /**
     * When set, dictates how long the notification will exist before calling `onClose`.
     * If unset, the notification will not automatically call `onClose`.
     * - `short`: 5s
     * - `long`: 10s
     */
    duration?: 'short' | 'long';
    /** Function that gets executed when close button is clicked or when duration expires. */
    onClose?: (event?: React.SyntheticEvent) => void;
    /**
     * Determines notification colors
     * - `default`: black
     * - `info`: green
     * - `warn`: yellow
     * - `error`: red
     */
    type?: NotificationType;
    /** How notification text overflow is handled */
    overflow?: 'wrap' | 'ellipsis';
    /** When true, render Blueprint v2 icons instead of the local icon set */
    useV2Icons?: boolean;
}

class Notification extends React.Component<NotificationProps & WrappedComponentProps> {
    static defaultProps: Pick<NotificationProps, 'overflow' | 'type'> = {
        overflow: OVERFLOW_WRAP,
        type: TYPE_DEFAULT,
    };

    componentDidMount() {
        const { duration, onClose } = this.props;
        this.timeout = duration && onClose ? setTimeout(onClose, DURATION_TIMES[duration]) : null;
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onClose = (event?: React.SyntheticEvent) => {
        const { onClose } = this.props;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (onClose) {
            onClose(event);
        }
    };

    getChildren() {
        const { children } = this.props;
        return typeof children === 'string' ? <span>{children}</span> : children;
    }

    timeout: ReturnType<typeof setTimeout> | null;

    render() {
        const contents = this.getChildren();
        const { intl, type = TYPE_DEFAULT, overflow, className, useV2Icons } = this.props;
        const { formatMessage } = intl;
        const classes = classNames('notification', type, overflow, className);
        const iconRenderer = ICON_RENDERER[type](useV2Icons);
        const iconColor = useV2Icons ? '#222' : '#fff';

        return (
            <div className={classes}>
                {React.cloneElement(iconRenderer, {
                    color: iconColor,
                    height: 20,
                    width: 20,
                })}
                {contents}
                <button
                    aria-label={formatMessage(messages.clearNotificationButtonText)}
                    className="close-btn"
                    onClick={this.onClose}
                    type="button"
                >
                    {useV2Icons ? <XMark height={32} width={32} /> : <X16 />}
                </button>
            </div>
        );
    }
}

export default injectIntl(Notification);
