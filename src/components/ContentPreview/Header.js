/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
import { BOX_BLUE } from '../../constants';
import IconCross from '../icons/IconCross';
import IconSidebar from '../icons/IconSidebar';
import { getIcon } from '../Item/iconCellRenderer';
import type { BoxItem } from '../../flowTypes';
import './Header.scss';

type Props = {
    file?: BoxItem,
    getLocalizedMessage: Function,
    isSidebarVisible: boolean,
    hasSidebar: boolean,
    toggleSidebar: Function,
    onClose?: Function
};

const Header = ({ file, hasSidebar, onClose, getLocalizedMessage, isSidebarVisible, toggleSidebar }: Props) => {
    const name = file ? file.name : '';
    const close = getLocalizedMessage('buik.modal.dialog.share.button.close');
    const sidebar = isSidebarVisible
        ? getLocalizedMessage('buik.modal.preview.dialog.button.sidebar.show.title')
        : getLocalizedMessage('buik.modal.preview.dialog.button.sidebar.hide.title');

    return (
        <div className='bcpr-header'>
            <div className='bcpr-name'>
                {file ? getIcon(24, file) : null}
                <span>
                    {name}
                </span>
            </div>
            <div className='bcpr-btns'>
                {hasSidebar &&
                    <PlainButton className='bcpr-btn' onClick={toggleSidebar} title={sidebar} aria-label={sidebar}>
                        <IconSidebar color={isSidebarVisible ? BOX_BLUE : '#777'} width={16} height={16} />
                    </PlainButton>}
                {onClose &&
                    <PlainButton className='bcpr-btn' onClick={onClose} title={close} aria-label={close}>
                        <IconCross color='#777' width={14} height={14} />
                    </PlainButton>}
            </div>
        </div>
    );
};

export default Header;
