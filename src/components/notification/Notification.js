// @flow
import * as React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

import Information from '@box/blueprint-web-assets/icons/Medium/Information';
import Check from '@box/blueprint-web-assets/icons/Medium/Check';
import AlertTriangle from '@box/blueprint-web-assets/icons/Medium/AlertTriangle';
import AlertBadge from '@box/blueprint-web-assets/icons/Medium/AlertBadge';
import XMark from '@box/blueprint-web-assets/icons/Medium/XMark';

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

const ICON_RENDERER: { [string]: Function } = {
    [TYPE_DEFAULT]: useV2Icons => (useV2Icons ? <Information /> : <InfoBadge16 />),
    [TYPE_ERROR]: useV2Icons => (useV2Icons ? <AlertBadge /> : <XBadge16 />),
    [TYPE_INFO]: useV2Icons => (useV2Icons ? <Check /> : <CircleCheck16 />),
    [TYPE_WARN]: useV2Icons => (useV2Icons ? <AlertTriangle /> : <TriangleAlert16 />),
};

const messages = defineMessages({
    clearNotificationButtonText: {
        defaultMessage: 'Clear Notification',
        description: 'Button to clear notification',
        id: 'boxui.notification.clearNotification',
    },
});

type Props = {
    /**
     * The contents of the `Notification`.
     * - Notification text must be wrapped in a `<span />` tag.
     * - Notification buttons must be the `<Button />` component.
     */
    children: React.Node,
    className?: string,
    duration?: 'short' | 'long',
    /** `duration`: When set, dictates how long the notification will exist before calling `onClose`.
     *  If unset, the notification will not automatically call `onClose`.
     * - `short`: 5s
     * - `long`: 10s */
    intl: Object,
    /** Function that gets executed when close button is clicked or when duration expires. */
    onClose?: Function,
    /**
     * Determines notification colors
     * - `default`: black
     * - `info`: green
     * - `warn`: yellow
     * - `error`: red
     */
    type: NotificationType,
    overflow?: 'wrap' | 'ellipsis',
    useV2Icons?: boolean,
};

class Notification extends React.Component<Props> {
    static defaultProps = {
        overflow: OVERFLOW_WRAP,
        type: TYPE_DEFAULT,
    };

    componentDidMount() {
        const { duration, onClose } = this.props;
        this.timeout = duration && onClose ? setTimeout(onClose, DURATION_TIMES[duration]) : null;
    }

    onClose = event => {
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

    timeout: TimeoutID | null;

    render() {
        const contents = this.getChildren();
        const { intl, type, overflow, className, useV2Icons } = this.props;
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
