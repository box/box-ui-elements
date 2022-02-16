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
import PlainButton from '../../../components/plain-button/PlainButton';
import Button from '../../../components/button';
import BoxDrive140 from '../../../../es/illustration/BoxDrive140';
import { DEFAULT_FETCH_END } from '../../../constants';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import type { BoxItemVersion } from '../../../common/types/core';
import './VersionsSidebar.scss';

const MAX_VERSIONS = DEFAULT_FETCH_END;

type Props = {
    error?: MessageDescriptor,
    errorTitle?: MessageDescriptor,
    fileId: string,
    isLoading: boolean,
    onUpgradeClick?: () => void,
    parentName: string,
    showUpsell: boolean,
    showUpsellWithPicture: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsSidebar = ({
    error,
    errorTitle,
    onUpgradeClick,
    isLoading,
    parentName,
    showUpsell,
    showUpsellWithPicture,
    versions,
    ...rest
}: Props) => {
    const showLimit = versions.length >= MAX_VERSIONS;
    const showVersions = !!versions.length;
    const showEmpty = !isLoading && !showVersions && !onUpgradeClick;
    const showError = !!error;

    const upsellOverlay = () => {
        if (showUpsell || showUpsellWithPicture) {
            return (
                <div className="bcs-upsell-wrapper">
                    <div className="bcs-version-upsell">
                        {showUpsellWithPicture && <BoxDrive140 className="bcs-version-upsell-icon" />}
                        <p className="bcs-upgrade-now">Upgrade Now</p>
                        <p className="bcs-upgrade-now-message">
                            <FormattedMessage {...messages.versionUpsell} />
                        </p>
                        <Button
                            className="bcs-upgrade-button"
                            data-resin-target="versioning_error_error_message_upgrade_cta"
                            onClick={onUpgradeClick}
                        >
                            <FormattedMessage {...messages.upgradeButton} />
                        </Button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <SidebarContent
            className="bcs-Versions"
            data-resin-component="preview"
            data-resin-feature="versions"
            overlay={upsellOverlay()}
            title={
                <>
                    <BackButton data-resin-target="back" to={`/${parentName}`} />
                    <FormattedMessage {...messages.versionsTitle} />
                </>
            }
        >
            <LoadingIndicatorWrapper className="bcs-Versions-content" crawlerPosition="top" isLoading={isLoading}>
                {showError && (
                    <InlineError title={<FormattedMessage {...errorTitle} />}>
                        <FormattedMessage {...error} />
                        {onUpgradeClick && (
                            <PlainButton
                                onClick={onUpgradeClick}
                                data-resin-target="versioning_error_error_message_upgrade_cta"
                                type="button"
                                className="bcs-Versions-upgrade"
                            >
                                <FormattedMessage {...messages.versionUpgradeButton} />
                            </PlainButton>
                        )}
                    </InlineError>
                )}

                {showEmpty && (
                    <div className="bcs-Versions-empty">
                        <FormattedMessage {...messages.versionsEmpty} />
                    </div>
                )}

                {showVersions && (
                    <div className="bcs-Versions-menu">
                        <VersionsMenu versions={versions} showVersionPreview {...rest} />
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
