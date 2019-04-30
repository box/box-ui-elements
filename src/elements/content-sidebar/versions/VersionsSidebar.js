/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import InlineError from '../../../components/inline-error';
import messages from './messages';
import messagesCommon from '../../common/messages';
import SidebarContent from '../SidebarContent';
import VersionsList from './VersionsList';
import { BackButton } from '../../common/nav-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import type { VersionActionCallback } from './Versions';
import './VersionsSidebar.scss';

type Props = {
    error?: string,
    isLoading: boolean,
    onDelete: VersionActionCallback,
    onDownload: VersionActionCallback,
    onPreview: VersionActionCallback,
    onPromote: VersionActionCallback,
    parentName: string,
    permissions: BoxItemPermission,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({
    error,
    isLoading,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    parentName,
    permissions,
    versions,
}: Props) => (
    <SidebarContent
        className="bcs-Versions"
        title={
            <React.Fragment>
                <BackButton path={`/${parentName}`} />
                <FormattedMessage {...messages.versionsTitle} />
            </React.Fragment>
        }
    >
        <LoadingIndicatorWrapper className="bcs-Versions-content" crawlerPosition="top" isLoading={isLoading}>
            {error ? (
                <InlineError title={<FormattedMessage {...messagesCommon.error} />}>{error}</InlineError>
            ) : (
                <VersionsList
                    isLoading={isLoading}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    onPromote={onPromote}
                    permissions={permissions}
                    versions={versions}
                />
            )}
        </LoadingIndicatorWrapper>
    </SidebarContent>
);

export default VersionsSidebar;
