/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconDrawAnnotationMode from 'box-react-ui/lib/icons/annotations/IconDrawAnnotation';
import IconPointAnnotation from 'box-react-ui/lib/icons/annotations/IconPointAnnotation';
import IconPrint from 'box-react-ui/lib/icons/general/IconPrint';
import IconDownload from 'box-react-ui/lib/icons/general/IconDownloadSolid';
import messages from 'elements/common/messages';
import { getIcon } from 'elements/common/item/iconCellRenderer';
import { COLOR_999 } from '../../constants';
import ContentOpenWith from '../content-open-with/ContentOpenWith';
import './Header.scss';

type Props = {
    canAnnotate: boolean,
    canDownload: boolean,
    contentOpenWithProps?: ContentOpenWithProps,
    file?: BoxItem,
    onClose?: Function,
    onDownload: Function,
    onPrint: Function,
    token: ?string,
} & InjectIntlProvidedProps;

const Header = ({
    canAnnotate,
    canDownload,
    contentOpenWithProps = {},
    file,
    intl,
    onClose,
    onDownload,
    onPrint,
    token,
}: Props) => {
    const name = file ? file.name : '';
    const id = file && file.id;
    const closeMsg = intl.formatMessage(messages.close);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);
    const drawMsg = intl.formatMessage(messages.drawAnnotation);
    const pointMsg = intl.formatMessage(messages.pointAnnotation);
    const shouldRenderOpenWith = id && contentOpenWithProps.show;

    return (
        <div className="bcpr-header">
            <div className="bp-header bp-base-header">
                <div className="bcpr-name">
                    {file ? getIcon(24, file) : null}
                    <span>{name}</span>
                </div>
                <div className="bcpr-btns">
                    {shouldRenderOpenWith && (
                        <ContentOpenWith
                            className="bcpr-bcow-btn"
                            fileId={id}
                            token={token}
                            {...contentOpenWithProps}
                        />
                    )}
                    {canAnnotate && (
                        <React.Fragment>
                            <PlainButton
                                type="button"
                                className="bcpr-btn bp-btn-annotate-draw bp-is-hidden"
                                title={drawMsg}
                                aria-label={drawMsg}
                            >
                                <IconDrawAnnotationMode color={COLOR_999} width={18} height={18} />
                            </PlainButton>
                            <PlainButton
                                type="button"
                                className="bcpr-btn bp-btn-annotate-point bp-is-hidden"
                                title={pointMsg}
                                aria-label={pointMsg}
                            >
                                <IconPointAnnotation color={COLOR_999} width={18} height={18} />
                            </PlainButton>
                        </React.Fragment>
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
                            <IconDownload color={COLOR_999} width={18} height={18} />
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
        </div>
    );
};

export default injectIntl(Header);
