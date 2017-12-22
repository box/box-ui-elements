/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconSidebar from 'box-react-ui/lib/icons/general/IconSidebar';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import messages from '../messages';
import { getIcon } from '../Item/iconCellRenderer';
import { COLOR_BOX_BLUE, COLOR_777 } from '../../constants';
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
                <span>{name}</span>
            </div>
            <div className='bcpr-btns'>
                {hasSidebarButton && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onSidebarToggle}
                        title={sidebar}
                        aria-label={sidebar}
                    >
                        <IconSidebar color={isSidebarVisible ? COLOR_BOX_BLUE : COLOR_777} width={16} height={16} />
                    </PlainButton>
                )}
                {onClose && (
                    <PlainButton type='button' className='bcpr-btn' onClick={onClose} title={close} aria-label={close}>
                        <IconClose color={COLOR_777} />
                    </PlainButton>
                )}
            </div>
        </div>
    );
};

export default injectIntl(Header);
