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
import StaticVersionsItem from './StaticVersionsItem';

import './StaticVersionsSidebar.scss';

type Props = {
    isLoading: boolean,
    onUpgradeClick?: () => void,
    parentName: string,
    showUpsellWithPicture: boolean,
};

const StaticVersionsSidebar = ({ onUpgradeClick, isLoading, parentName, showUpsellWithPicture }: Props) => {
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
                    <section>
                        <h4 className="bcs-static-VersionsGroup-heading">
                            <FormattedMessage {...messages.versionsToday} />
                        </h4>
                        <ul>
                            <li>
                                <StaticVersionsItem versionNumber="1" />
                            </li>
                            <li>
                                <StaticVersionsItem versionNumber="2" />
                            </li>
                            <li>
                                <StaticVersionsItem versionNumber="3" />
                            </li>
                        </ul>
                    </section>
                </LoadingIndicatorWrapper>
            </div>

            <div className="bcs-upsell-wrapper">
                <div className="bcs-version-upsell">
                    {showUpsellWithPicture && <BoxDrive140 className="bcs-version-upsell-icon" />}
                    <p className="bcs-upgrade-now">
                        <FormattedMessage {...messages.versionUpgradeButton} />
                    </p>
                    <p>
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
        </div>
    );
};

export default StaticVersionsSidebar;
