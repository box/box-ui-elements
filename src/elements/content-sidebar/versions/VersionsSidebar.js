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
import './VersionsSidebar.scss';

type Props = {
    error?: string,
    isLoading: boolean,
    parentName: string,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({ error, isLoading, parentName, versions }: Props) => {
    const hasVersions = !!versions && !!versions.length;
    const hideContent = !error && !hasVersions;

    return (
        <SidebarContent
            className="bcs-Versions"
            title={
                <React.Fragment>
                    <BackButton path={`/${parentName}`} />
                    <FormattedMessage {...messages.versionsTitle} />
                </React.Fragment>
            }
        >
            <LoadingIndicatorWrapper className="bcs-Versions-content" isLoading={isLoading} hideContent={hideContent}>
                {error ? (
                    <InlineError title={<FormattedMessage {...messagesCommon.error} />}>{error}</InlineError>
                ) : (
                    <VersionsList versions={versions} />
                )}
            </LoadingIndicatorWrapper>
        </SidebarContent>
    );
};

export default VersionsSidebar;
