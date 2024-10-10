/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import InlineError from '../../../components/inline-error';
import messages from './messages';
import SidebarContent from '../SidebarContent';
import VersionsMenu from './VersionsMenu';
import { BackButton } from '../../common/nav-button';
import { DEFAULT_FETCH_END } from '../../../constants';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import type { BoxItemVersion } from '../../../common/types/core';
import './VersionsSidebar.scss';

const MAX_VERSIONS = DEFAULT_FETCH_END;

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
    const showLimit = versions.length >= MAX_VERSIONS;
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
                    <div className="bcs-Versions-menu" data-testid="bcs-Versions-menu">
                        <VersionsMenu versions={versions} {...rest} />
                    </div>
                )}
                {showLimit && (
                    <div className="bcs-Versions-maxEntries" data-testid="max-versions">
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
