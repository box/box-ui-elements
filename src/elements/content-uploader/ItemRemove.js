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
    isUploading: boolean,
    onClick: Function,
};

const ItemRemove = ({ onClick, isUploading }: Props) => {
    let resin = {};
    const tooltip = <FormattedMessage {...messages.remove} />;

    if (isUploading) {
        resin = { 'data-resin-target': 'uploadcancel' };
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
