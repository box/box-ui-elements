/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { BackButton } from '../../common/nav-button';
import Button from '../../../components/button';
import BoxDrive140 from '../../../illustration/BoxDrive140';

import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';

import VersionsMenu from './VersionsMenu';
import './StaticVersionsSidebar.scss';

type Props = {
    isLoading: boolean,
    onUpgradeClick?: () => void,
    parentName: string,
    showUpsellWithPicture: boolean,
};

const StaticVersionsSidebar = ({ isLoading, onUpgradeClick, parentName, showUpsellWithPicture }: Props): React.Node => {
    const versionTimestamp = new Date();
    versionTimestamp.setDate(versionTimestamp.getDate() - 1);

    const versions = ['1', '2', '3'].map(versionNumber => {
        return {
            id: versionNumber,
            version_number: versionNumber,
            type: 'file_version',
            permissions: {
                can_preview: true,
            },
            created_at: versionTimestamp.toUTCString(),
            modified_by: null,
            size: 1875887,
            trashed_at: null,
            uploader_display_name: messages.versionStaticUser.defaultMessage,
        };
    });

    return (
        <div
            className="bcs-static-Versions"
            role="tabpanel"
            data-resin-component="preview"
            data-resin-feature="versions"
        >
            <div className="bcs-static-content-header">
                <h3 className="bcs-static-title">
                    <>
                        <BackButton data-resin-target="back" to={`/${parentName}`} />
                        <FormattedMessage {...messages.versionsTitle} />
                    </>
                </h3>
            </div>
            <div className="bcs-static-scroll-content-wrapper">
                <LoadingIndicatorWrapper
                    className="bcs-static-Versions-content"
                    crawlerPosition="top"
                    isLoading={isLoading}
                >
                    <div className="bcs-Versions-menu">
                        <VersionsMenu versions={versions} fileId="1" versionCount={3} versionLimit={3} />
                    </div>
                </LoadingIndicatorWrapper>
            </div>

            <div className="bcs-upsell-wrapper">
                <div className="bcs-version-upsell">
                    {showUpsellWithPicture && <BoxDrive140 className="bcs-version-upsell-icon" />}
                    <p className="bcs-upgrade-now">
                        <FormattedMessage {...messages.versionUpgradeLink} />
                    </p>
                    <p>
                        <FormattedMessage {...messages.versionUpsell} />
                    </p>
                    <Button
                        className="bcs-upgrade-button"
                        data-resin-target="versioning_error_upgrade_cta"
                        onClick={onUpgradeClick}
                    >
                        <FormattedMessage {...messages.upgradeButton} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StaticVersionsSidebar;
