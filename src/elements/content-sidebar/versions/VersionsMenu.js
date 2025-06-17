/**
 * @flow
 * @file Versions Menu component
 * @author Box
 */

import * as React from 'react';
import last from 'lodash/last';
import { injectIntl } from 'react-intl';
import * as util from '../../../utils/datetime';
import messages from './messages';
import VersionsGroup from './VersionsGroup';
import type { BoxItemVersion } from '../../../common/types/core';
import type { InternalSidebarNavigation } from '../../common/types/SidebarNavigation.flow';
import './VersionsMenu.scss';

type Props = {
    fileId: string,
    intl: any,
    internalSidebarNavigation?: InternalSidebarNavigation,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

type VersionGroups = Array<{ groupHeading: string, groupVersions: Array<BoxItemVersion> }>;

const getHeading = ({ intl, version }: { intl: any, version: BoxItemVersion }): string => {
    const { created_at: createdAt } = version;
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentSunday = currentDate.getDate() - currentDay;
    const createdAtDate = util.convertToDate(createdAt);
    let heading;

    if (util.isToday(createdAtDate)) {
        heading = intl.formatMessage(messages.versionsToday); // Today
    } else if (util.isYesterday(createdAtDate)) {
        heading = intl.formatMessage(messages.versionsYesterday); // Yesterday
    } else if (!util.isCurrentYear(createdAtDate)) {
        heading = intl.formatDate(createdAt, { year: 'numeric' }); // 2018
    } else if (!util.isCurrentMonth(createdAtDate)) {
        heading = intl.formatDate(createdAt, { month: 'long' }); // January
    } else if (createdAtDate.getDate() <= currentSunday - 7) {
        heading = intl.formatMessage(messages.versionsThisMonth); // This Month
    } else if (createdAtDate.getDate() <= currentSunday) {
        heading = intl.formatMessage(messages.versionsPriorWeek); // Last Week
    } else {
        heading = intl.formatDate(createdAt, { weekday: 'long' }); // Monday
    }

    return heading;
};

const VersionsMenu = React.memo<Props>(({ intl, versions, ...rest }: Props) => {
    const { id: currentId } = versions[0] || {};

    // Build an ordered set of groups with headings based on the original order of the versions array
    const versionGroups = versions.reduce((groups: VersionGroups, version: BoxItemVersion): VersionGroups => {
        const currentGroup = last(groups);
        const groupHeading = getHeading({ intl, version });

        // Push a new group if there are no groups or if the heading has changed
        if (!currentGroup || currentGroup.groupHeading !== groupHeading) {
            groups.push({
                groupHeading,
                groupVersions: [],
            });
        }

        // Push the sorted version to the newest group's versions collection
        last(groups).groupVersions.push(version);
        return groups;
    }, []);

    return (
        <ul className="bcs-VersionsMenu">
            {versionGroups.map(({ groupHeading, groupVersions }) => (
                <li className="bcs-VersionsMenu-item" key={groupHeading}>
                    <VersionsGroup currentId={currentId} heading={groupHeading} versions={groupVersions} {...rest} />
                </li>
            ))}
        </ul>
    );
});

export default injectIntl(VersionsMenu);
