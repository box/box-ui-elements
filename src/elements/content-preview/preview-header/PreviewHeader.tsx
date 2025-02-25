import * as React from 'react';
import { useIntl } from 'react-intl';
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
import PlainButton from '../../../components/plain-button/PlainButton';
import { ButtonType } from '../../../components/button';
import { bdlGray50 } from '../../../styles/variables';

import messages from '../../common/messages';

import type { BoxItem, BoxItemVersion } from '../../../common/types/core';
import type { ContentAnswersProps } from '../../common/content-answers/ContentAnswers';
import type { ContentOpenWithProps } from '../../content-open-with/ContentOpenWith';

import './PreviewHeader.scss';

export interface PreviewHeaderProps {
    canAnnotate: boolean;
    canDownload: boolean;
    canPrint?: boolean;
    contentAnswersProps?: Partial<ContentAnswersProps>;
    contentOpenWithProps?: Partial<ContentOpenWithProps>;
    file?: BoxItem;
    logoUrl?: string;
    onClose?: React.MouseEventHandler<HTMLButtonElement>;
    onDownload: React.MouseEventHandler<HTMLButtonElement>;
    onPrint: React.MouseEventHandler<HTMLButtonElement>;
    selectedVersion: BoxItemVersion | null;
    token: string | null;
}

const LoadableContentAnswers = AsyncLoad({
    // @ts-ignore Dynamic import for lazy loading
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-answers" */ '../../common/content-answers'),
}) as React.ComponentType<ContentAnswersProps>;
const LoadableContentOpenWith = AsyncLoad({
    // @ts-ignore Dynamic import for lazy loading
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-open-with" */ '../../content-open-with'),
}) as React.ComponentType<ContentOpenWithProps>;

const PreviewHeader = ({
    canAnnotate,
    canDownload,
    canPrint,
    contentAnswersProps = {} as Partial<ContentAnswersProps>,
    contentOpenWithProps = {} as Partial<ContentOpenWithProps>,
    file,
    logoUrl,
    onClose,
    onDownload,
    onPrint,
    selectedVersion,
    token,
}: PreviewHeaderProps) => {
    const { formatMessage } = useIntl();

    const fileId = file && file.id;
    const shouldRenderAnswers = fileId && contentAnswersProps.show;
    const shouldRenderOpenWith = fileId && contentOpenWithProps.show;
    const currentVersionId = getProp(file, 'file_version.id');
    const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
    const isPreviewingCurrentVersion = currentVersionId === selectedVersionId;

    // When previewing an older version the close button returns the user to the current version
    const closeMsg = isPreviewingCurrentVersion ? formatMessage(messages.close) : formatMessage(messages.back);
    const printMsg = formatMessage(messages.print);
    const downloadMsg = formatMessage(messages.download);
    const drawMsg = formatMessage(messages.drawAnnotation);
    const pointMsg = formatMessage(messages.pointAnnotation);

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
            <div className="bcpr-PreviewHeader-content bp-header bp-base-header">
                {logoUrl ? <Logo url={logoUrl} /> : <FileInfo file={file || null} version={selectedVersion} />}
                <div className="bcpr-PreviewHeader-controls">
                    {isPreviewingCurrentVersion && (
                        <>
                            {shouldRenderOpenWith && (
                                <LoadableContentOpenWith
                                    className="bcpr-bcow-btn"
                                    fileId={fileId}
                                    token={token}
                                    {...contentOpenWithProps}
                                />
                            )}
                            {shouldRenderAnswers && (
                                <LoadableContentAnswers
                                    className="bcpr-PreviewHeader-contentAnswers"
                                    file={file}
                                    {...contentAnswersProps}
                                />
                            )}
                            {canAnnotate && (
                                <>
                                    <PlainButton
                                        aria-label={drawMsg}
                                        className="bcpr-PreviewHeader-button bp-btn-annotate-draw bp-is-hidden"
                                        title={drawMsg}
                                        type={ButtonType.BUTTON}
                                    >
                                        <IconDrawAnnotationMode color={bdlGray50} height={18} width={18} />
                                    </PlainButton>
                                    <PlainButton
                                        aria-label={pointMsg}
                                        className="bcpr-PreviewHeader-button bp-btn-annotate-point bp-is-hidden"
                                        title={pointMsg}
                                        type={ButtonType.BUTTON}
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
                                    type={ButtonType.BUTTON}
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
                                    type={ButtonType.BUTTON}
                                >
                                    <IconDownload color={bdlGray50} height={18} width={18} />
                                </PlainButton>
                            )}
                        </>
                    )}
                    {onClose && (
                        <PlainButton
                            aria-label={isPreviewingCurrentVersion && closeMsg}
                            className="bcpr-PreviewHeader-button bcpr-PreviewHeader-button-close"
                            onClick={onClose}
                            type={ButtonType.BUTTON}
                        >
                            {isPreviewingCurrentVersion ? (
                                <IconClose color={bdlGray50} height={24} width={24} />
                            ) : (
                                closeMsg
                            )}
                        </PlainButton>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PreviewHeader;
