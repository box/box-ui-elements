/**
 * @flow
 * @file Item remove component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';

type Props = {
    isFailed: boolean,
    isUploading: boolean,
    onClick: Function,
};

const ItemRemove = ({ isFailed, isUploading, onClick }: Props) => {
    const resin = {};
    let target = null;
    const tooltip = <FormattedMessage {...messages.remove} />;

    if (isUploading) {
        target = 'uploadcancel';
    } else if (isFailed) {
        target = 'remove-failed';
    }

    if (target) {
        resin['data-resin-target'] = target;
    }

    return (
        <div className="bcu-item-action">
            <Tooltip position="top-left" text={tooltip}>
                <PlainButton onClick={onClick} type="button" {...resin}>
                    <IconClose />
                </PlainButton>
            </Tooltip>
        </div>
    );
};

export default ItemRemove;
