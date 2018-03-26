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
import IconPrint from 'box-react-ui/lib/icons/general/IconPrint';
import IconDownload from 'box-react-ui/lib/icons/general/IconDownloadSolid';
import messages from '../messages';
import { getIcon } from '../Item/iconCellRenderer';
import { COLOR_BOX_BLUE, COLOR_777 } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './Header.scss';

type Props = {
    file?: BoxItem,
    hasSidebarButton: boolean,
    isSidebarVisible: boolean,
    onPrint: Function,
    canDownload: boolean,
    onDownload: Function,
    onClose?: Function,
    onSidebarToggle?: Function,
    intl: any
};

const Header = ({
    file,
    isSidebarVisible,
    onClose,
    hasSidebarButton,
    onSidebarToggle,
    onPrint,
    canDownload,
    onDownload,
    intl
}: Props) => {
    const name = file ? file.name : '';
    const closeMsg = intl.formatMessage(messages.close);
    const sidebarMsg = isSidebarVisible
        ? intl.formatMessage(messages.sidebarHide)
        : intl.formatMessage(messages.sidebarShow);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);
    const shouldShowButtons =
        canDownload && file && file.permissions ? file.permissions.can_download && file.is_download_available : false;

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
                        title={sidebarMsg}
                        aria-label={sidebarMsg}
                    >
                        <IconSidebar color={isSidebarVisible ? COLOR_BOX_BLUE : COLOR_777} width={16} height={16} />
                    </PlainButton>
                )}
                {shouldShowButtons && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onPrint}
                        title={printMsg}
                        aria-label={printMsg}
                    >
                        <IconPrint color={COLOR_777} width={22} height={22} />
                    </PlainButton>
                )}
                {shouldShowButtons && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onDownload}
                        title={downloadMsg}
                        aria-label={downloadMsg}
                    >
                        <IconDownload color={COLOR_777} width={18} height={18} />
                    </PlainButton>
                )}
                {onClose && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onClose}
                        title={closeMsg}
                        aria-label={closeMsg}
                    >
                        <IconClose color={COLOR_777} width={24} height={24} />
                    </PlainButton>
                )}
            </div>
        </div>
    );
};

export default injectIntl(Header);
