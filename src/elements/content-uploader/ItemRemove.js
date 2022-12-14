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

const ItemRemove = ({ onClick, status, intl }: Props) => {
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

    return (
        <div className="bcu-item-action">
            <Tooltip position="top-left" text={intl.formatMessage(messages.remove)}>
                <PlainButton
                    aria-label={intl.formatMessage(messages.remove)}
                    isDisabled={status === STATUS_STAGED}
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

export default injectIntl(ItemRemove);
