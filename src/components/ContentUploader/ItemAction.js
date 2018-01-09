/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import Tooltip from 'box-react-ui/lib/components/tooltip';
import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconRetry from 'box-react-ui/lib/icons/general/IconRetry';
import IconInProgress from './IconInProgress';
import messages from '../messages';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';
import type { UploadStatus } from '../../flowTypes';
import './ItemAction.scss';

const ICON_CHECK_COLOR = '#26C281';

type Props = {
    status: UploadStatus,
    onClick: Function,
    intl: any,
    rootElement: HTMLElement
};

const ItemAction = ({ status, onClick, intl, rootElement }: Props) => {
    let icon = <IconClose />;
    let title = intl.formatMessage(messages.cancel);
    let tooltip = '';

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color={ICON_CHECK_COLOR} />;
            title = intl.formatMessage(messages.remove);
            break;
        case STATUS_ERROR:
            icon = <IconRetry />;
            title = intl.formatMessage(messages.retry);
            break;
        case STATUS_IN_PROGRESS:
            icon = <IconInProgress />;
            title = intl.formatMessage(messages.remove);
            tooltip = intl.formatMessage(messages.uploadsCancelButtonTooltip);
            break;
        case STATUS_PENDING:
        default:
        // empty
    }

    const button = (
        <PlainButton type='button' onClick={onClick} title={title}>
            {icon}
        </PlainButton>
    );

    return (
        <div className='bcu-item-action'>
            {tooltip ? (
                <Tooltip text={tooltip} position='top-left' bodyElement={rootElement}>
                    {button}
                </Tooltip>
            ) : (
                button
            )}
        </div>
    );
};

export default injectIntl(ItemAction);
