/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
import IconCross from '../icons/IconCross';
import { getIcon } from '../Item/iconCellRenderer';
import type { BoxItem } from '../../flowTypes';
import './Header.scss';

type Props = {
    file?: BoxItem,
    getLocalizedMessage: Function,
    onClose?: Function
};

const Header = ({ file, onClose, getLocalizedMessage }: Props) => {
    const name = file ? file.name : '';
    const close = getLocalizedMessage('buik.modal.dialog.share.button.close');
    return (
        <div className='bcpr-header'>
            <div className='bcpr-name'>
                {file ? getIcon(24, file) : null}
                <span>
                    {name}
                </span>
            </div>
            <div className='bcpr-btns'>
                {onClose &&
                    <PlainButton className='bcpr-btn' onClick={onClose} title={close} aria-label={close}>
                        <IconCross color='#777' width={14} height={14} />
                    </PlainButton>}
            </div>
        </div>
    );
};

export default Header;
