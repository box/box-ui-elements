/**
 * @flow
 * @file Item resume component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconRetry from '../../icons/general/IconRetry';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';
import { bdlGreenLight } from '../../styles/variables';
import messages from '../common/messages';

type Props = {
    isFolder: boolean,
    onClick: Function,
    size: number,
    status: UploadStatus,
};

const ItemResume = ({ status, onClick, isFolder = false }: Props) => {
    let icon;
    const resin = {};
    let tooltip;

    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color={bdlGreenLight} />;
            break;
        case STATUS_ERROR:
            icon = <IconRetry height={24} width={24} />;
            tooltip = <FormattedMessage {...messages.resume} />;
            resin['data-resin-target'] = 'uploadretry';
            break;
        case STATUS_IN_PROGRESS:
            icon = <LoadingIndicator />;
            break;
        case STATUS_PENDING:
        default:
        // empty
    }

    const shownIcon =
        status === STATUS_ERROR ? (
            <Tooltip position="top-left" text={tooltip}>
                <PlainButton onClick={onClick} type="button" {...resin}>
                    {icon}
                </PlainButton>
            </Tooltip>
        ) : (
            icon
        );

    return <div className="bcu-item-action">{shownIcon}</div>;
};

export default ItemResume;
