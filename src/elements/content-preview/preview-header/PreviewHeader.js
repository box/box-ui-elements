/**
 * @flow
 * @file Preview header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AsyncLoad from '../../common/async-load';
import FileInfo from './FileInfo';
import IconClose from '../../../icons/general/IconClose';
import IconDownload from '../../../icons/general/IconDownloadSolid';
import IconDrawAnnotationMode from '../../../icons/annotations/IconDrawAnnotation';
import IconPointAnnotation from '../../../icons/annotations/IconPointAnnotation';
import IconPrint from '../../../icons/general/IconPrint';
import Logo from '../../common/header/Logo';
import messages from '../../common/messages';
import PlainButton from '../../../components/plain-button/PlainButton';
import { bdlGray50, bdlYellorange, bdlBoxBlue50 } from '../../../styles/variables';
import type { BoxItem, BoxItemVersion } from '../../../common/types/core';

import './PreviewHeader.scss';
import IconStar from 'icons/general/IconStar';
import IconStarSolid from 'icons/general/IconStarSolid';
import { PermissionLevel } from '../../../components/permission-level/PermissionLevel';

type Props = {
    canAnnotate: boolean,
    canDownload: boolean,
    canPrint?: boolean,
    contentOpenWithProps?: ContentOpenWithProps,
    file?: BoxItem,
    logoUrl?: string,
    onClose?: Function,
    onDownload: Function,
    onPrint: Function,
    selectedVersion: ?BoxItemVersion,
    token: ?string,
    canAddToFavoriteCollection: boolean,
    canRemoveFromFavoriteCollection: boolean,
    onItemAddFavoriteCollection: Function,
    onItemRemoveFromFavoriteCollection: Function,
    onVersionChange: Function,
    history: any,
    canDownloadRepresentation: boolean,
    onDownloadRepresentation: Function,
    onPrintRepresentation: Function,
    currentUser: any,
    isLoading: boolean
} & InjectIntlProvidedProps;

const LoadableContentOpenWith = AsyncLoad({
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-open-with" */ '../../content-open-with'),
});

const PreviewHeader = ({
    canAnnotate,
    canDownload,
    canPrint,
    contentOpenWithProps = {},
    file,
    intl,
    logoUrl,
    onClose,
    onDownload,
    onPrint,
    selectedVersion,
    token,
    canAddToFavoriteCollection,
    canRemoveFromFavoriteCollection,
    onItemAddFavoriteCollection,
    onItemRemoveFromFavoriteCollection,
    collaborationRole,
    onVersionChange,
    history,
    canDownloadRepresentation,
    onDownloadRepresentation,
    onPrintRepresentation,
    currentUser,
    isLoading
}: Props) => {
    const fileId = file && file.id;
    const shouldRenderOpenWith = fileId && contentOpenWithProps.show;
    const currentVersionId = getProp(file, 'file_version.id');
    const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
    const isPreviewingCurrentVersion = currentVersionId === selectedVersionId;

    // When previewing an older version the close button returns the user to the current version
    const closeMsg = isPreviewingCurrentVersion
        ? intl.formatMessage(messages.close)
        : intl.formatMessage(messages.back);
    const printMsg = intl.formatMessage(messages.print);
    const downloadMsg = intl.formatMessage(messages.download);
    const drawMsg = intl.formatMessage(messages.drawAnnotation);
    const pointMsg = intl.formatMessage(messages.pointAnnotation);
    const addToFavoritesMsg = intl.formatMessage(messages.addToFavoritesLabel);
    const removeFavoritesMsg = intl.formatMessage(messages.removeFavoritesLabel);
    const currentVersionMsg = intl.formatMessage(messages.currentVersion);

    return (
        <header
            className={classNames('bcpr-PreviewHeader', {
                'bcpr-PreviewHeader--basic': !isPreviewingCurrentVersion,
            })}
        >
            {/*
                bp-header and bp-base-header are used by box-annotations,
                and must be put one level under bcpr-PreviewHeader
            */}
            <div style={{ gap: 16 }} className="permission-level-mobile">
                {!canDownloadRepresentation && !canDownload && !canPrint && !isLoading && (
                    <div style={{ fontWeight: 600 }}>{currentUser?.name || ''}</div>
                )}

                <PermissionLevel level={collaborationRole}></PermissionLevel>
            </div>
            <div className="bcpr-PreviewHeader-content bp-header bp-base-header">
                {logoUrl ? <Logo url={logoUrl} /> : <FileInfo file={file} version={selectedVersion} />}

                <div className="bcpr-PreviewHeader-controls">
                    {isPreviewingCurrentVersion && (
                        <>
                            <div style={{ marginRight: 30, gap: 16 }} className="preview-permission-level">
                                {!canDownloadRepresentation && !canDownload && !canPrint && !isLoading && (
                                    <div style={{ fontWeight: 600 }}>{currentUser?.name || ''}</div>
                                )}
                                <PermissionLevel level={collaborationRole}></PermissionLevel>
                            </div>
                            {canAddToFavoriteCollection && (
                                <PlainButton
                                    aria-label={addToFavoritesMsg}
                                    className="bcpr-PreviewHeader-button"
                                    onClick={onItemAddFavoriteCollection}
                                    title={addToFavoritesMsg}
                                    type="button"
                                >
                                    <IconStar color={bdlGray50} height={18} width={18}></IconStar>
                                </PlainButton>
                            )}
                            {canRemoveFromFavoriteCollection && (
                                <PlainButton
                                    aria-label={removeFavoritesMsg}
                                    className="bcpr-PreviewHeader-button"
                                    onClick={onItemRemoveFromFavoriteCollection}
                                    title={removeFavoritesMsg}
                                    type="button"
                                >
                                    <IconStarSolid color={bdlYellorange} height={18} width={18}></IconStarSolid>
                                </PlainButton>
                            )}
                            {shouldRenderOpenWith && (
                                <LoadableContentOpenWith
                                    className="bcpr-bcow-btn"
                                    fileId={fileId}
                                    token={token}
                                    {...contentOpenWithProps}
                                />
                            )}
                            {canAnnotate && (
                                <>
                                    <PlainButton
                                        aria-label={drawMsg}
                                        className="bcpr-PreviewHeader-button bp-btn-annotate-draw bp-is-hidden"
                                        title={drawMsg}
                                        type="button"
                                    >
                                        <IconDrawAnnotationMode color={bdlGray50} height={18} width={18} />
                                    </PlainButton>
                                    <PlainButton
                                        aria-label={pointMsg}
                                        className="bcpr-PreviewHeader-button bp-btn-annotate-point bp-is-hidden"
                                        title={pointMsg}
                                        type="button"
                                    >
                                        <IconPointAnnotation color={bdlGray50} height={18} width={18} />
                                    </PlainButton>
                                </>
                            )}
                            {canPrint && (
                                <PlainButton
                                    aria-label={printMsg}
                                    className="bcpr-PreviewHeader-button"
                                    onClick={onPrint}
                                    title={printMsg}
                                    type="button"
                                >
                                    <IconPrint color={bdlGray50} height={22} width={22} />
                                </PlainButton>
                            )}

                            {canDownload && (
                                <PlainButton
                                    aria-label={downloadMsg}
                                    className="bcpr-PreviewHeader-button"
                                    onClick={onDownload}
                                    title={downloadMsg}
                                    type="button"
                                >
                                    <IconDownload color={bdlGray50} height={18} width={18} />
                                </PlainButton>
                            )}
                            {canDownloadRepresentation && !canDownload && (
                                <>
                                    <PlainButton
                                        aria-label={printMsg}
                                        className="bcpr-PreviewHeader-button"
                                        onClick={onPrintRepresentation}
                                        title={printMsg}
                                        type="button"
                                    >
                                        <IconPrint color={bdlBoxBlue50} height={22} width={22} />
                                    </PlainButton>

                                    <PlainButton
                                        aria-label={downloadMsg}
                                        className="bcpr-PreviewHeader-button"
                                        onClick={onDownloadRepresentation}
                                        title={downloadMsg}
                                        type="button"
                                    >
                                        <IconDownload color={bdlBoxBlue50} height={18} width={18} />
                                    </PlainButton>
                                </>
                            )}
                        </>
                    )}

                    {onClose && (
                        <PlainButton
                            aria-label={isPreviewingCurrentVersion && closeMsg}
                            className="bcpr-PreviewHeader-button bcpr-PreviewHeader-button-close"
                            onClick={onClose}
                            title={isPreviewingCurrentVersion && closeMsg}
                            type="button"
                        >
                            {isPreviewingCurrentVersion ? (
                                <IconClose color={bdlGray50} height={24} width={24} />
                            ) : (
                                closeMsg
                            )}
                        </PlainButton>
                    )}

                    {!isPreviewingCurrentVersion && (
                        <PlainButton
                            aria-label={currentVersionMsg}
                            className="bcpr-PreviewHeader-button bcpr-PreviewHeader-button-close"
                            onClick={() =>
                                onVersionChange(currentVersionId, {
                                    currentVersionId: currentVersionId,
                                    updateVersionToCurrent: history.push(`/details/versions/${currentVersionId}`),
                                })
                            }
                            title={currentVersionMsg}
                            type="button"
                        >
                            {currentVersionMsg}
                        </PlainButton>
                    )}
                </div>
            </div>
        </header>
    );
};

export default injectIntl(PreviewHeader);
