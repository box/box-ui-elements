/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from './messages';

import { BackButton } from '../../common/nav-button';
import Button from '../../../components/button';
import BoxDrive140 from '../../../illustration/BoxDrive140';

import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import StaticVersionsItem from './StaticVersionsItem';

import './StaticVersionsSidebar.scss';
import './VersionsSidebar.scss';
import './VersionsItem.scss';
import './VersionsItemButton.scss';
import './VersionsGroup.scss';
import '../SidebarContent.scss';

type Props = {
    isLoading: boolean,
    onUpgradeClick?: () => void,
    parentName: string,
    showUpsellWithPicture: boolean,
};

const StaticVersionsSidebar = ({ onUpgradeClick, isLoading, parentName, showUpsellWithPicture }: Props) => {
    const elementId = '';
    const sidebarView = '';
    const label = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;
    const id = `${label}-content`;

    return (
        <div
            aria-labelledby={label}
            className={classNames('bcs-content', 'bcs-Versions')}
            data-testid="bcs-content"
            id={id}
            role="tabpanel"
            data-resin-component="preview"
            data-resin-feature="versions"
        >
            <div className="bcs-content-header">
                <h3 className="bcs-title">
                    <>
                        <BackButton data-resin-target="back" to={`/${parentName}`} />
                        <FormattedMessage {...messages.versionsTitle} />
                    </>
                </h3>
            </div>
            <div className="bcs-scroll-content-wrapper">
                <div className="bcs-scroll-content">
                    <LoadingIndicatorWrapper
                        className="bcs-Versions-content"
                        crawlerPosition="top"
                        isLoading={isLoading}
                    >
                        <div className="bcs-Versions-menu">
                            <ul className="bcs-VersionsMenu">
                                <li className="bcs-VersionsMenu-item" key="versionsToday">
                                    <section className="bcs-VersionsGroup">
                                        <h4 className="bcs-VersionsGroup-heading">
                                            <FormattedMessage {...messages.versionsToday} />
                                        </h4>
                                        <ul className="bcs-VersionsList">
                                            <li className="bcs-VersionsList-item" key={1}>
                                                <StaticVersionsItem
                                                    versionNumber="1"
                                                    versionTime="2021-11-29T15:01:19-08:00"
                                                />
                                            </li>
                                            <li className="bcs-VersionsList-item" key={2}>
                                                <StaticVersionsItem
                                                    versionNumber="2"
                                                    versionTime="2021-11-29T15:01:19-08:00"
                                                />
                                            </li>
                                            <li className="bcs-VersionsList-item" key={3}>
                                                <StaticVersionsItem
                                                    versionNumber="3"
                                                    versionTime="2021-11-29T15:01:19-08:00"
                                                />
                                            </li>
                                        </ul>
                                    </section>
                                </li>
                            </ul>{' '}
                        </div>
                    </LoadingIndicatorWrapper>
                </div>
            </div>
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
        </div>
    );
};

export default StaticVersionsSidebar;
