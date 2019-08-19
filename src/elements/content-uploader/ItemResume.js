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
import messages from '../common/messages';

const ICON_CHECK_COLOR = '#26C281';
const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 104857600; // 100MB

type Props = {
    isFolder?: boolean,
    onClick: Function,
    size: number,
    status: UploadStatus,
};

const ItemResume = ({ status, size, onClick, isFolder = false }: Props) => {
    let icon;
    let resin = {};
    let tooltip;
    let shownIcon;

    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color={ICON_CHECK_COLOR} />;
            break;
        case STATUS_ERROR:
            icon = <IconRetry height={24} width={24} />;
            if (size > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
                tooltip = <FormattedMessage {...messages.resume} />;
            } else {
                tooltip = <FormattedMessage {...messages.retry} />;
            }
            resin = { 'data-resin-target': 'uploadretry' };
            break;
        case STATUS_IN_PROGRESS:
            icon = <LoadingIndicator />;
            break;
        case STATUS_PENDING:
        default:
        // empty
    }

    if (status === STATUS_ERROR) {
        shownIcon = (
            <Tooltip position="top-left" text={tooltip}>
                <PlainButton onClick={onClick} type="button" {...resin}>
                    {icon}
                </PlainButton>
            </Tooltip>
        );
    } else {
        shownIcon = icon;
    }

    return <div className="bcu-item-action">{shownIcon}</div>;
};

export default ItemResume;
