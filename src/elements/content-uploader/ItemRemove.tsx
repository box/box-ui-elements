import * as React from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { XMark } from '@box/blueprint-web-assets/icons/Fill';

import type { UploadItem, UploadStatus } from '../../common/types/upload';

import { STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_STAGED } from '../../constants';

import messages from '../common/messages';

export interface ItemRemoveProps {
    onClick: (item: UploadItem) => void;
    status: UploadStatus;
}

const ItemRemove = ({ onClick, status }: ItemRemoveProps) => {
    const { formatMessage } = useIntl();

    const resin: Record<string, string> = {};
    let target = null;

    if (status === STATUS_IN_PROGRESS) {
        target = 'uploadcancel';
    } else if (status === STATUS_ERROR) {
        target = 'remove-failed';
    }

    if (target) {
        resin['data-resin-target'] = target;
    }

    const isDisabled = status === STATUS_STAGED;
    const tooltipText = formatMessage(messages.remove);

    return (
        <div className="bcu-item-action">
            <Tooltip content={tooltipText}>
                <IconButton aria-label={tooltipText} disabled={isDisabled} onClick={onClick} icon={XMark} {...resin} />
            </Tooltip>
        </div>
    );
};

export default ItemRemove;
