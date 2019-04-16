/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AsyncLoad from '../../common/async-load';
import FileInfo from './FileInfo';
import IconClose from '../../../icons/general/IconClose';
import IconDrawAnnotationMode from '../../../icons/annotations/IconDrawAnnotation';
import IconPointAnnotation from '../../../icons/annotations/IconPointAnnotation';
import IconPrint from '../../../icons/general/IconPrint';
import IconDownload from '../../../icons/general/IconDownloadSolid';
import messages from '../../common/messages';
import { nines } from '../../../styles/variables';
import PlainButton from '../../../components/plain-button/PlainButton';

import './Header.scss';

type Props = {
    canAnnotate: boolean,
    canDownload: boolean,
    contentOpenWithProps?: ContentOpenWithProps,
    file?: BoxItem,
    onClose?: Function,
    onDownload: Function,
    onPrint: Function,
    selectedVersion: ?BoxItemVersion,
    token: ?string,
} & InjectIntlProvidedProps;

const LoadableContentOpenWith = AsyncLoad({
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-open-with" */ '../../content-open-with'),
});

const PreviewHeader = ({
    canAnnotate,
    canDownload,
    contentOpenWithProps = {},
    file,
    intl,
    onClose,
    onDownload,
    onPrint,
    selectedVersion,
    token,
}: Props) => {
    const fileId = file && file.id;
    const shouldRenderOpenWith = fileId && contentOpenWithProps.show;
    const currentVersionId = getProp(file, 'file_version.id');
    const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
    const isPreviewingCurrentVersion = currentVersionId === selectedVersionId;
    const displayItem = selectedVersion || file;

    // When previewing an older version the close button returns the user to the current version
    const closeMsg = intl.formatMessage(messages.close);
    const backMsg = intl.formatMessage(messages.back);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);
    const drawMsg = intl.formatMessage(messages.drawAnnotation);
    const pointMsg = intl.formatMessage(messages.pointAnnotation);

    const className = classNames('bcpr-header', {
        'bcpr-header--basic': !isPreviewingCurrentVersion,
    });

    return (
        <div className={className}>
            <div className="bp-header bp-base-header">
                <FileInfo item={displayItem} />
                <div className="bcpr-btns">
                    {shouldRenderOpenWith && isPreviewingCurrentVersion && (
                        <LoadableContentOpenWith
                            className="bcpr-bcow-btn"
                            fileId={fileId}
                            token={token}
                            {...contentOpenWithProps}
                        />
                    )}
                    {canAnnotate && isPreviewingCurrentVersion && (
                        <React.Fragment>
                            <PlainButton
                                aria-label={drawMsg}
                                className="bcpr-btn bp-btn-annotate-draw bp-is-hidden"
                                title={drawMsg}
                                type="button"
                            >
                                <IconDrawAnnotationMode color={nines} height={18} width={18} />
                            </PlainButton>
                            <PlainButton
                                aria-label={pointMsg}
                                className="bcpr-btn bp-btn-annotate-point bp-is-hidden"
                                title={pointMsg}
                                type="button"
                            >
                                <IconPointAnnotation color={nines} height={18} width={18} />
                            </PlainButton>
                        </React.Fragment>
                    )}
                    {canDownload && isPreviewingCurrentVersion && (
                        <PlainButton
                            aria-label={printMsg}
                            className="bcpr-btn"
                            onClick={onPrint}
                            title={printMsg}
                            type="button"
                        >
                            <IconPrint color={nines} height={22} width={22} />
                        </PlainButton>
                    )}
                    {canDownload && isPreviewingCurrentVersion && (
                        <PlainButton
                            aria-label={downloadMsg}
                            className="bcpr-btn"
                            onClick={onDownload}
                            title={downloadMsg}
                            type="button"
                        >
                            <IconDownload color={nines} height={18} width={18} />
                        </PlainButton>
                    )}
                    {onClose &&
                        (isPreviewingCurrentVersion ? (
                            <PlainButton
                                aria-label={closeMsg}
                                className="bcpr-btn"
                                onClick={onClose}
                                title={closeMsg}
                                type="button"
                            >
                                <IconClose color={nines} height={24} width={24} />
                            </PlainButton>
                        ) : (
                            <PlainButton className="bcpr-btn" onClick={onClose} title={backMsg} type="button">
                                {backMsg}
                            </PlainButton>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default injectIntl(PreviewHeader);
