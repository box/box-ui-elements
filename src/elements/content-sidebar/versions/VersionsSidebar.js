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
import SidebarSection from '../SidebarSection';
import type { VersionActionCallback } from './Versions';
import VersionsList from './VersionsList';
import { BackButton } from '../../common/nav-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import './VersionsSidebar.scss';

type Props = {
    error?: string,
    isLoading: boolean,
    onPreview: VersionActionCallback,
    parentName: string,
    permissions: BoxItemPermission,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({ error, isLoading, onPreview, parentName, permissions, versions }: Props) => (
    <SidebarContent
        className="bcs-Versions"
        title={
            <React.Fragment>
                <BackButton path={`/${parentName}`} />
                <FormattedMessage {...messages.versionsTitle} />
            </React.Fragment>
        }
    >
        <LoadingIndicatorWrapper className="bcs-Versions-content" isLoading={isLoading}>
            {!isLoading && (
                <SidebarSection isOpen>
                    {error ? (
                        <InlineError title={<FormattedMessage {...messagesCommon.error} />}>{error}</InlineError>
                    ) : (
                        <VersionsList
                            isLoading={isLoading}
                            onPreview={onPreview}
                            permissions={permissions}
                            versions={versions}
                        />
                    )}
                </SidebarSection>
            )}
        </LoadingIndicatorWrapper>
    </SidebarContent>
);

export default VersionsSidebar;
