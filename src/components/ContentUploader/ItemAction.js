/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import Tooltip from 'box-react-ui/lib/components/tooltip';
import IconCross from '../icons/IconCross';
import IconCheck from '../icons/IconCheck';
import IconRetry from '../icons/IconRetry';
import IconInProgress from './IconInProgress';
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
    let tooltip = intl.formatMessage(messages.uploadsCancelButtonTooltip);

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color='#26C281' />;
            title = intl.formatMessage(messages.remove);
            break;
        case STATUS_ERROR:
            icon = <IconRetry />;
            title = intl.formatMessage(messages.retry);
            tooltip = intl.formatMessage(messages.uploadsRetryButtonTooltip);
            break;
        case STATUS_IN_PROGRESS:
            icon = <IconInProgress />;
            title = intl.formatMessage(messages.remove);
            break;
        case STATUS_PENDING:
        default:
        // empty
    }

    return (
        <div className='bcu-item-action'>
            <Tooltip text={tooltip} position='top-left'>
                <PlainButton type='button' onClick={onClick} title={title}>
                    {icon}
                </PlainButton>
            </Tooltip>
        </div>
    );
};

export default injectIntl(ItemAction);
