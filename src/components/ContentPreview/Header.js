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
import OpenWith from '../OpenWith/OpenWith';
import './Header.scss';

type Props = {
    openWithProps: OpenWithProps,
    token: ?string,
    file?: BoxItem,
    onPrint: Function,
    canDownload: boolean,
    onDownload: Function,
    onClose?: Function,
    intl: any,
};

const Header = ({
    openWithProps = {},
    token,
    file,
    onClose,
    onPrint,
    canDownload,
    onDownload,
    intl,
}: Props) => {
    const name = file ? file.name : '';
    const id = file && file.id;
    const closeMsg = intl.formatMessage(messages.close);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);
    const shouldRenderOpenWith = id && openWithProps.show;

    return (
        <div className="bcpr-header">
            <div className="bcpr-name">
                {file ? getIcon(24, file) : null}
                <span>{name}</span>
            </div>
            <div className="bcpr-btns">
                {shouldRenderOpenWith && (
                    <OpenWith
                        className="bcpr-bcow-btn"
                        fileId={id}
                        token={token}
                        {...openWithProps}
                    />
                )}
                {canDownload && (
                    <PlainButton
                        type="button"
                        className="bcpr-btn"
                        onClick={onPrint}
                        title={printMsg}
                        aria-label={printMsg}
                    >
                        <IconPrint color={COLOR_999} width={22} height={22} />
                    </PlainButton>
                )}
                {canDownload && (
                    <PlainButton
                        type="button"
                        className="bcpr-btn"
                        onClick={onDownload}
                        title={downloadMsg}
                        aria-label={downloadMsg}
                    >
                        <IconDownload
                            color={COLOR_999}
                            width={18}
                            height={18}
                        />
                    </PlainButton>
                )}
                {onClose && (
                    <PlainButton
                        type="button"
                        className="bcpr-btn"
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
