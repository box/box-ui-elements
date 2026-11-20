/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import type { MessageDescriptor } from 'react-intl';
import InlineError from '../../../components/inline-error';
import messages from './messages';
import SidebarContent from '../SidebarContent';
import VersionsExperienceMenu from './VersionsExperienceMenu';
import VersionsMenu from './VersionsMenu';
import BackButton from '../../common/back-button';
import PlainButton from '../../../components/plain-button';
import { DEFAULT_FETCH_END } from '../../../constants';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import { useFeatureEnabled } from '../../common/feature-checking';
import type { BoxItemVersion } from '../../../common/types/core';
import type {
    InternalSidebarNavigation,
    InternalSidebarNavigationHandler,
    ViewTypeValues,
} from '../../common/types/SidebarNavigation';
import './VersionsSidebar.scss';

const { useCallback, useState } = React;

const UI_STORAGE_KEY = 'bcs-versions-use-old-ui';

const getStoredUseOldUi = (): boolean => {
    try {
        return window.localStorage.getItem(UI_STORAGE_KEY) === 'true';
    } catch (e) {
        return false;
    }
};

const MAX_VERSIONS = DEFAULT_FETCH_END;

type Props = {
    error?: MessageDescriptor,
    fileId: string,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isLoading: boolean,
    parentName: ViewTypeValues,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

type VersionsContentProps = {
    error?: MessageDescriptor,
    fileId: string,
    history?: any,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isLoading: boolean,
    parentName: ViewTypeValues,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsContent = ({
    error,
    history,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isLoading,
    parentName,
    routerDisabled,
    versions,
    ...rest
}: VersionsContentProps) => {
    const isVersionExperienceAvailable = useFeatureEnabled('versions.versionExperience.enabled');
    const [useOldUi, setUseOldUi] = useState<boolean>(getStoredUseOldUi);
    const isVersionExperienceEnabled = isVersionExperienceAvailable && !useOldUi;

    const handleToggleUi = useCallback(() => {
        setUseOldUi(previous => {
            const next = !previous;
            try {
                window.localStorage.setItem(UI_STORAGE_KEY, String(next));
            } catch (e) {
                // Storage can be unavailable (e.g. private mode); the choice then only lasts for this session.
            }
            return next;
        });
    }, []);
    const showLimit = versions.length >= MAX_VERSIONS;
    const showVersions = !!versions.length;
    const showEmpty = !isLoading && !showVersions;
    const showError = !!error;

    const handleBackClick = useCallback(() => {
        if (routerDisabled && internalSidebarNavigationHandler) {
            internalSidebarNavigationHandler({ sidebar: parentName });
        } else if (!routerDisabled && history) {
            history.push(`/${parentName}`);
        }
    }, [parentName, routerDisabled, internalSidebarNavigationHandler, history]);

    return (
        <SidebarContent
            className="bcs-Versions"
            data-resin-component="preview"
            data-resin-feature="versions"
            title={
                <>
                    <BackButton data-resin-target="back" onClick={handleBackClick} />
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

                {isVersionExperienceAvailable && showVersions && (
                    <PlainButton
                        className="bcs-Versions-uiToggle"
                        data-testid="versions-ui-toggle"
                        onClick={handleToggleUi}
                        type="button"
                    >
                        <FormattedMessage
                            {...(useOldUi
                                ? messages.versionExperienceSwitchToNew
                                : messages.versionExperienceSwitchToOld)}
                        />
                    </PlainButton>
                )}

                {showVersions && (
                    <div className="bcs-Versions-menu" data-testid="bcs-Versions-menu">
                        {isVersionExperienceEnabled ? (
                            <VersionsExperienceMenu
                                versions={versions}
                                routerDisabled={routerDisabled}
                                internalSidebarNavigation={internalSidebarNavigation}
                                {...rest}
                            />
                        ) : (
                            <VersionsMenu
                                versions={versions}
                                routerDisabled={routerDisabled}
                                internalSidebarNavigation={internalSidebarNavigation}
                                {...rest}
                            />
                        )}
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

const VersionsSidebar = (props: Props) => {
    const { routerDisabled } = props;

    if (routerDisabled) {
        return <VersionsContent {...props} />;
    }

    return <Route>{({ history }) => <VersionsContent {...props} history={history} />}</Route>;
};

export default VersionsSidebar;
