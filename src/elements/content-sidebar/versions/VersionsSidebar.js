/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import InlineError from '../../../components/inline-error';
import messages from './messages';
import SidebarContent from '../SidebarContent';
import VersionsMenu from './VersionsMenu';
import { BackButton } from '../../common/nav-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import './VersionsSidebar.scss';

type Props = {
    error?: MessageDescriptor,
    fileId: string,
    isLoading: boolean,
    parentName: string,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({ error, isLoading, parentName, versions, ...rest }: Props) => {
    const MAX_VERSIONS = 1000;
    const maxVersions = versions.length >= 1000;
    const showVersions = !!versions.length;
    const showEmpty = !isLoading && !showVersions;
    const showError = !!error;

    return (
        <SidebarContent
            className="bcs-Versions"
            data-resin-component="preview"
            data-resin-feature="versions"
            title={
                <>
                    <BackButton data-resin-target="back" to={`/${parentName}`} />
                    <FormattedMessage {...messages.versionsTitle} />
                </>
            }
        >
            <LoadingIndicatorWrapper className="bcs-Versions-content" crawlerPosition="top" isLoading={isLoading}>
                {showError && (
                    <InlineError title={<FormattedMessage {...messages.versionServerError} />}>
                        <FormattedMessage {...error} />
                    </InlineError>
                )}

                {showEmpty && (
                    <div className="bcs-Versions-empty">
                        <FormattedMessage {...messages.versionsEmpty} />
                    </div>
                )}

                {showVersions && (
                    <div className="bcs-Versions-menu">
                        <VersionsMenu versions={versions} {...rest} />
                    </div>
                )}
                {maxVersions && (
                    <div className="bcs-Versions-max-entries">
                        <FormattedMessage
                            {...messages.versionMaxEntries}
                            values={{
                                maxVersions: MAX_VERSIONS,
                            }}
                        />
                    </div>
                )}
            </LoadingIndicatorWrapper>
        </SidebarContent>
    );
};

export default VersionsSidebar;
