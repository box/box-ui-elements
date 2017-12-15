/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import messages from '../messages';
import IconCross from '../icons/IconCross';
import IconSidebar from '../icons/IconSidebar';
import { getIcon } from '../Item/iconCellRenderer';
import { BOX_BLUE } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './Header.scss';

type Props = {
    file?: BoxItem,
    hasSidebarButton: boolean,
    isSidebarVisible: boolean,
    onClose?: Function,
    onSidebarToggle?: Function,
    intl: any
};

const Header = ({ file, isSidebarVisible, onClose, hasSidebarButton, onSidebarToggle, intl }: Props) => {
    const name = file ? file.name : '';
    const close = intl.formatMessage(messages.close);
    const sidebar = isSidebarVisible
        ? intl.formatMessage(messages.sidebarHide)
        : intl.formatMessage(messages.sidebarShow);

    return (
        <div className='bcpr-header'>
            <div className='bcpr-name'>
                {file ? getIcon(24, file) : null}
                <span>
                    {name}
                </span>
            </div>
            <div className='bcpr-btns'>
                {hasSidebarButton &&
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onSidebarToggle}
                        title={sidebar}
                        aria-label={sidebar}
                    >
                        <IconSidebar color={isSidebarVisible ? BOX_BLUE : '#777'} width={16} height={16} />
                    </PlainButton>}
                {onClose &&
                    <PlainButton type='button' className='bcpr-btn' onClick={onClose} title={close} aria-label={close}>
                        <IconCross color='#777' width={14} height={14} />
                    </PlainButton>}
            </div>
        </div>
    );
};

export default injectIntl(Header);
