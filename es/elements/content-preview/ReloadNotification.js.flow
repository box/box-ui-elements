/**
 * @flow
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button/Button';
import { Notification, NotificationConstants } from '../../components/notification';
import messages from '../common/messages';
import './ReloadNotification.scss';

type Props = {
    onClick: () => void,
    onClose: () => void,
};

const ReloadNotification = ({ onClick, onClose }: Props) => (
    <span className="bcpr-notification">
        <Notification onClose={onClose} type={NotificationConstants.TYPE_INFO}>
            <FormattedMessage {...messages.previewUpdate} />
            <Button onClick={onClick}>
                <FormattedMessage {...messages.reload} />
            </Button>
        </Notification>
    </span>
);

export default ReloadNotification;
