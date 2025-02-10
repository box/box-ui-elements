/**
 * @flow
 * @file Static Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';

import BoxDrive140 from '../../../illustration/BoxDrive140';

import { BackButton } from '../../common/nav-button';
import PrimaryButton from '../../../components/primary-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import VersionsMenu from './VersionsMenu';

import messages from './messages';

import './StaticVersionsSidebar.scss';

type Props = {
    isLoading: boolean,
    onUpgradeClick: () => void,
    parentName: string,
};

const StaticVersionsSidebar = ({ isLoading, onUpgradeClick, parentName }: Props): React.Node => {
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
            uploader_display_name: 'John Doe',
        };
    });

    return (
        <div
            className="bcs-StaticVersionSidebar"
            role="tabpanel"
            data-resin-component="preview"
            data-resin-feature="versions"
        >
            <div className="bcs-StaticVersionSidebar-header">
                <Text as="h3" className="bcs-StaticVersionSidebar-title">
                    <>
                        <BackButton data-resin-target="back" to={`/${parentName}`} />
                        <FormattedMessage {...messages.versionsTitle} />
                    </>
                </Text>
            </div>

            <div className="bcs-StaticVersionSidebar-content-wrapper">
                <LoadingIndicatorWrapper
                    className="bcs-StaticVersionSidebar-content"
                    crawlerPosition="top"
                    isLoading={isLoading}
                >
                    <VersionsMenu versions={versions} fileId="1" versionCount={3} versionLimit={3} />
                </LoadingIndicatorWrapper>
            </div>

            <div className="bcs-StaticVersionSidebar-upsell-wrapper">
                <div className="bcs-StaticVersionSidebar-upsell">
                    <BoxDrive140 className="bcs-StaticVersionSidebar-upsell-icon" />
                    <Text as="p" className="bcs-StaticVersionSidebar-upsell-header">
                        <FormattedMessage {...messages.versionUpgradeLink} />
                    </Text>
                    <Text as="p">
                        <FormattedMessage {...messages.versionUpsell} />
                    </Text>
                    <PrimaryButton
                        className="bcs-StaticVersionSidebar-upsell-button"
                        data-resin-target="versioning_error_upgrade_cta"
                        onClick={onUpgradeClick}
                        type="button"
                    >
                        <FormattedMessage {...messages.upgradeButton} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default StaticVersionsSidebar;
