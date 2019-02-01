/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'components/plain-button/PlainButton';
import Tooltip from 'components/tooltip';
import IconCheck from 'icons/general/IconCheck';
import IconClose from 'icons/general/IconClose';
import IconRetry from 'icons/general/IconRetry';
import messages from 'elements/common/messages';
import IconInProgress from './IconInProgress';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';

import './ItemAction.scss';

const ICON_CHECK_COLOR = '#26C281';

type Props = {
    isFolder?: boolean,
    onClick: Function,
    status: UploadStatus,
} & InjectIntlProvidedProps;

const ItemAction = ({ status, onClick, intl, isFolder = false }: Props) => {
    let icon = <IconClose />;
    let tooltip = intl.formatMessage(messages.uploadsCancelButtonTooltip);

    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color={ICON_CHECK_COLOR} />;
            tooltip = intl.formatMessage(messages.remove);
            break;
        case STATUS_ERROR:
            icon = <IconRetry />;
            tooltip = intl.formatMessage(messages.retry);
            break;
        case STATUS_IN_PROGRESS:
            icon = <IconInProgress />;
            break;
        case STATUS_PENDING:
        default:
        // empty
    }

    return (
        <div className="bcu-item-action">
            <Tooltip position="top-left" text={tooltip}>
                <PlainButton onClick={onClick} type="button">
                    {icon}
                </PlainButton>
            </Tooltip>
        </div>
    );
};

export { ItemAction as ItemActionForTesting };
export default injectIntl(ItemAction);
