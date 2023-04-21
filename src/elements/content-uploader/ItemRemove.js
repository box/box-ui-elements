/**
 * @flow
 * @file Item remove component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';
import { STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_STAGED } from '../../constants';

import type { UploadItem, UploadStatus } from '../../common/types/upload';

type Props = {
    onClick: (item: UploadItem) => void,
    status: UploadStatus,
} & InjectIntlProvidedProps;

const ItemRemove = ({ intl, onClick, status }: Props) => {
    const resin = {};
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
    const tooltipText = intl.formatMessage(messages.remove);

    return (
        <div className="bcu-item-action">
            <Tooltip position="top-left" text={tooltipText}>
                <PlainButton
                    aria-label={tooltipText}
                    isDisabled={isDisabled}
                    onClick={onClick}
                    type="button"
                    {...resin}
                >
                    <IconClose />
                </PlainButton>
            </Tooltip>
        </div>
    );
};

export { ItemRemove as ItemRemoveBase };
export default injectIntl(ItemRemove);
