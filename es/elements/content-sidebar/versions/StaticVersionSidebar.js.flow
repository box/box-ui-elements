/**
 * @flow
 * @file Static Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';

import BoxDrive140 from '../../../illustration/BoxDrive140';

import BackButton from '../../common/back-button';
import PrimaryButton from '../../../components/primary-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import VersionsMenu from './VersionsMenu';
import type {
    InternalSidebarNavigation,
    InternalSidebarNavigationHandler,
    ViewTypeValues,
} from '../../common/types/SidebarNavigation';

import messages from './messages';

import './StaticVersionsSidebar.scss';

const { useCallback } = React;

type Props = {
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isLoading: boolean,
    onUpgradeClick: () => void,
    parentName: ViewTypeValues,
    routerDisabled?: boolean,
};

type StaticVersionsContentProps = {
    history?: any,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isLoading: boolean,
    onUpgradeClick: () => void,
    parentName: ViewTypeValues,
    routerDisabled?: boolean,
};

const StaticVersionsContent = ({
    history,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isLoading,
    onUpgradeClick,
    parentName,
    routerDisabled,
}: StaticVersionsContentProps): React.Node => {
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

    const handleBackClick = useCallback(() => {
        if (routerDisabled && internalSidebarNavigationHandler) {
            internalSidebarNavigationHandler({ sidebar: parentName });
        } else if (!routerDisabled && history) {
            history.push(`/${parentName}`);
        }
    }, [parentName, routerDisabled, internalSidebarNavigationHandler, history]);

    return (
        <div
            className="bcs-StaticVersionSidebar"
            role="tabpanel"
            data-resin-component="preview"
            data-resin-feature="versions"
        >
            <div className="bcs-StaticVersionSidebar-header">
                <h3 className="bcs-StaticVersionSidebar-title">
                    <>
                        <BackButton 
                            data-resin-target="back" 
                            onClick={handleBackClick} 
                        />
                        <FormattedMessage {...messages.versionsTitle} />
                    </>
                </h3>
            </div>

            <div className="bcs-StaticVersionSidebar-content-wrapper">
                <LoadingIndicatorWrapper
                    className="bcs-StaticVersionSidebar-content"
                    crawlerPosition="top"
                    isLoading={isLoading}
                >
                    <VersionsMenu
                        versions={versions}
                        fileId="1"
                        versionCount={3}
                        versionLimit={3}
                        routerDisabled={routerDisabled}
                        internalSidebarNavigation={internalSidebarNavigation}
                    />
                </LoadingIndicatorWrapper>
            </div>

            <div className="bcs-StaticVersionSidebar-upsell-wrapper">
                <div className="bcs-StaticVersionSidebar-upsell">
                    <BoxDrive140 className="bcs-StaticVersionSidebar-upsell-icon" />
                    <p className="bcs-StaticVersionSidebar-upsell-header">
                        <FormattedMessage {...messages.versionUpgradeLink} />
                    </p>
                    <p>
                        <FormattedMessage {...messages.versionUpsell} />
                    </p>
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

const StaticVersionsSidebar = (props: Props): React.Node => {
    const { routerDisabled } = props;

    if (routerDisabled) {
        return <StaticVersionsContent {...props} />;
    }

    return (
        <Route>
            {({ history }) => <StaticVersionsContent {...props} history={history} />}
        </Route>
    );
};

export default StaticVersionsSidebar;
