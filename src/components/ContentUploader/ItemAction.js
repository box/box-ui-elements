/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import IconCross from '../icons/IconCross';
import IconCheck from '../icons/IconCheck';
import IconRetry from '../icons/IconRetry';
import { PlainButton } from '../Button';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';
import type { UploadStatus } from '../../flowTypes';
import './ItemAction.scss';

type Props = {
    status: UploadStatus,
    onClick: Function,
    getLocalizedMessage: Function
};

const ItemAction = ({ status, onClick, getLocalizedMessage }: Props) => {
    let icon;
    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck />;
            break;
        case STATUS_ERROR:
            icon = <IconRetry />;
            break;
        case STATUS_PENDING:
        case STATUS_IN_PROGRESS:
        default:
            icon = <IconCross />;
            break;
    }

    return (
        <div className='bcu-item-action'>
            <PlainButton onClick={onClick} title={getLocalizedMessage(`buik.action.button.${status}`)}>
                {icon}
            </PlainButton>
        </div>
    );
};

export default ItemAction;
