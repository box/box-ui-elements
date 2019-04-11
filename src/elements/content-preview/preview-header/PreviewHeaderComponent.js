/**
 * @flow
 * @file Preview header container component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Header from './Header';
import VersionsHeader from './VersionsHeader';
import './Header.scss';

type Props = {
    canAnnotate: boolean,
    canDownload: boolean,
    contentOpenWithProps?: ContentOpenWithProps,
    file?: BoxItem,
    isPreviewingCurrentVersion: boolean,
    onClose?: Function,
    onDownload: Function,
    onPrint: Function,
    token: ?string,
} & InjectIntlProvidedProps;

const PreviewHeaderComponent = ({
    canAnnotate,
    canDownload,
    contentOpenWithProps,
    file,
    isPreviewingCurrentVersion,
    onClose,
    onDownload,
    onPrint,
    token,
}: Props) => {
    const classes = classNames(['bcpr-header', !isPreviewingCurrentVersion && 'bcpr-header--dark']);
    return (
        <div className={classes}>
            <div className="bp-header bp-base-header">
                {isPreviewingCurrentVersion ? (
                    <Header
                        canAnnotate={canAnnotate}
                        canDownload={canDownload}
                        contentOpenWithProps={contentOpenWithProps}
                        file={file}
                        onClose={onClose}
                        onDownload={onDownload}
                        onPrint={onPrint}
                        token={token}
                    />
                ) : (
                    <VersionsHeader file={file} onClose={onClose} />
                )}
            </div>
        </div>
    );
};

export default injectIntl(PreviewHeaderComponent);
