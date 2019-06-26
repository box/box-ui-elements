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
import VersionsGroup, { getGroup } from './VersionsGroup';
import { BackButton } from '../../common/nav-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import './VersionsSidebar.scss';

type Props = {
    error?: string,
    fileId: string,
    isLoading: boolean,
    parentName: string,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({ error, isLoading, fileId, parentName, versions, ...rest }: Props) => {
    const { id: currentId } = versions[0] || {};
    const showVersions = !!versions.length;
    const showEmpty = !isLoading && !showVersions;
    const versionGroups = versions.reduce((groups, version) => {
        const versionGroup = getGroup(version);

        groups[versionGroup] = groups[versionGroup] || [];
        groups[versionGroup].push(version);

        return groups;
    }, {});

    return (
        <SidebarContent
            className="bcs-Versions"
            data-resin-component="preview"
            data-resin-feature="versions"
            title={
                <React.Fragment>
                    <BackButton data-resin-target="back" to={`/${parentName}`} />
                    <FormattedMessage {...messages.versionsTitle} />
                </React.Fragment>
            }
        >
            <LoadingIndicatorWrapper className="bcs-Versions-content" crawlerPosition="top" isLoading={isLoading}>
                {error && <InlineError title={<FormattedMessage {...messagesCommon.error} />}>{error}</InlineError>}

                {showEmpty && (
                    <div className="bcs-Versions-empty">
                        <FormattedMessage {...messages.versionsEmpty} />
                    </div>
                )}

                {showVersions && (
                    <ul className="bcs-Versions-menu">
                        {Object.keys(versionGroups).map(versionGroupKey => (
                            <li className="bcs-Versions-menu-item" key={versionGroupKey}>
                                <VersionsGroup
                                    currentId={currentId}
                                    fileId={fileId}
                                    versionGroup={versionGroupKey}
                                    versions={versionGroups[versionGroupKey]}
                                    {...rest}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </LoadingIndicatorWrapper>
        </SidebarContent>
    );
};

export default VersionsSidebar;
