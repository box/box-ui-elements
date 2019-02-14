/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import IconClose from '../../icons/general/IconClose';
import IconDrawAnnotationMode from '../../icons/annotations/IconDrawAnnotation';
import IconPointAnnotation from '../../icons/annotations/IconPointAnnotation';
import IconPrint from '../../icons/general/IconPrint';
import IconDownload from '../../icons/general/IconDownloadSolid';
import AsyncLoad from '../common/async-load';
import messages from '../common/messages';
import { getIcon } from '../common/item/iconCellRenderer';
import { COLOR_999 } from '../../constants';
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

const LoadableContentOpenWith = AsyncLoad({
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-open-with" */ '../content-open-with'),
});

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
                        <LoadableContentOpenWith
                            className="bcpr-bcow-btn"
                            fileId={id}
                            token={token}
                            {...contentOpenWithProps}
                        />
                    )}
                    {canAnnotate && (
                        <React.Fragment>
                            <PlainButton
                                aria-label={drawMsg}
                                className="bcpr-btn bp-btn-annotate-draw bp-is-hidden"
                                title={drawMsg}
                                type="button"
                            >
                                <IconDrawAnnotationMode color={COLOR_999} height={18} width={18} />
                            </PlainButton>
                            <PlainButton
                                aria-label={pointMsg}
                                className="bcpr-btn bp-btn-annotate-point bp-is-hidden"
                                title={pointMsg}
                                type="button"
                            >
                                <IconPointAnnotation color={COLOR_999} height={18} width={18} />
                            </PlainButton>
                        </React.Fragment>
                    )}
                    {canDownload && (
                        <PlainButton
                            aria-label={printMsg}
                            className="bcpr-btn"
                            onClick={onPrint}
                            title={printMsg}
                            type="button"
                        >
                            <IconPrint color={COLOR_999} height={22} width={22} />
                        </PlainButton>
                    )}
                    {canDownload && (
                        <PlainButton
                            aria-label={downloadMsg}
                            className="bcpr-btn"
                            onClick={onDownload}
                            title={downloadMsg}
                            type="button"
                        >
                            <IconDownload color={COLOR_999} height={18} width={18} />
                        </PlainButton>
                    )}
                    {onClose && (
                        <PlainButton
                            aria-label={closeMsg}
                            className="bcpr-btn"
                            onClick={onClose}
                            title={closeMsg}
                            type="button"
                        >
                            <IconClose color={COLOR_999} height={24} width={24} />
                        </PlainButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default injectIntl(Header);
