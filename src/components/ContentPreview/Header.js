/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconPrint from 'box-react-ui/lib/icons/general/IconPrint';
import IconDownload from 'box-react-ui/lib/icons/general/IconDownloadSolid';
import messages from '../messages';
import { getIcon } from '../Item/iconCellRenderer';
import { COLOR_999 } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './Header.scss';

type Props = {
    file?: BoxItem,
    onPrint: Function,
    canDownload: boolean,
    onDownload: Function,
    onClose?: Function,
    intl: any
};

const Header = ({ file, onClose, onPrint, canDownload, onDownload, intl }: Props) => {
    const name = file ? file.name : '';
    const closeMsg = intl.formatMessage(messages.close);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);

    return (
        <div className='bcpr-header'>
            <div className='bcpr-name'>
                {file ? getIcon(24, file) : null}
                <span>{name}</span>
            </div>
            <div className='bcpr-btns'>
                {canDownload && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onPrint}
                        title={printMsg}
                        aria-label={printMsg}
                    >
                        <IconPrint color={COLOR_999} width={22} height={22} />
                    </PlainButton>
                )}
                {canDownload && (
                    <PlainButton
                        type='button'
                        className='bcpr-btn'
                        onClick={onDownload}
                        title={downloadMsg}
                        aria-label={downloadMsg}
                    >
                        <IconDownload color={COLOR_999} width={18} height={18} />
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
                        <IconClose color={COLOR_999} width={24} height={24} />
                    </PlainButton>
                )}
            </div>
        </div>
    );
};

export default injectIntl(Header);
