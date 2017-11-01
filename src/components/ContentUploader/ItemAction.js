/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import IconCross from '../icons/IconCross';
import IconCheck from '../icons/IconCheck';
import IconRetry from '../icons/IconRetry';
import { PlainButton } from '../Button';
import messages from '../messages';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';
import type { UploadStatus } from '../../flowTypes';
import './ItemAction.scss';

type Props = {
    status: UploadStatus,
    onClick: Function,
    intl: any
};

const ItemAction = ({ status, onClick, intl }: Props) => {
    let icon = <IconCross />;
    let title = intl.formatMessage(messages.cancel);

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck />;
            title = intl.formatMessage(messages.remove);
            break;
        case STATUS_ERROR:
            icon = <IconRetry />;
            title = intl.formatMessage(messages.retry);
            break;
        case STATUS_PENDING:
            title = intl.formatMessage(messages.remove);
            break;
        case STATUS_IN_PROGRESS:
        default:
        // empty
    }

    return (
        <div className='bcu-item-action'>
            <PlainButton onClick={onClick} title={title}>
                {icon}
            </PlainButton>
        </div>
    );
};

export default injectIntl(ItemAction);
