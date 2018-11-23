/**
 * @flow
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'box-react-ui/lib/components/button/Button';
import { Notification, NotificationConstants } from 'box-react-ui/lib/components/notification';
import messages from '../messages';
import './ReloadNotification.scss';

type Props = {
    onClick: () => void,
    onClose: () => void,
};

const ReloadNotification = ({ onClick, onClose }: Props) => (
    <span className="bcpr-notification">
        <Notification type={NotificationConstants.TYPE_INFO} onClose={onClose}>
            <FormattedMessage {...messages.previewUpdate} />
            <Button onClick={onClick}>
                <FormattedMessage {...messages.reload} />
            </Button>
        </Notification>
    </span>
);

export default ReloadNotification;
