/**
 * @flow
 * @file Versions Group component
 * @author Box
 */

import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import * as util from '../../../utils/datetime';
import messages from './messages';
import VersionsList from './VersionsList';
import './VersionsGroup.scss';

type Props = {
    currentId: string,
    fileId: string,
    versionGroup: string,
    versions: Array<BoxItemVersion>,
};

export const GROUPS = {
    PRIOR_MONTH: 'PRIOR_MONTH',
    PRIOR_WEEK: 'PRIOR_WEEK',
    PRIOR_YEAR: 'PRIOR_YEAR',
    THIS_MONTH: 'THIS_MONTH',
    TODAY: 'TODAY',
    WEEKDAY: 'WEEKDAY',
    YESTERDAY: 'YESTERDAY',
};

export const getGroup = ({ created_at: createdAt }: BoxItemVersion) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentSunday = currentDate.getDate() - currentDay;
    const createdAtDate = util.convertToDate(createdAt);
    let group;

    if (util.isToday(createdAtDate)) {
        group = GROUPS.TODAY;
    } else if (util.isYesterday(createdAtDate)) {
        group = GROUPS.YESTERDAY;
    } else if (!util.isCurrentYear(createdAtDate)) {
        group = GROUPS.PRIOR_YEAR;
    } else if (!util.isCurrentMonth(createdAtDate)) {
        group = GROUPS.PRIOR_MONTH;
    } else if (createdAtDate.getDate() <= currentSunday - 7) {
        group = GROUPS.THIS_MONTH;
    } else if (createdAtDate.getDate() <= currentSunday) {
        group = GROUPS.PRIOR_WEEK;
    } else {
        group = GROUPS.WEEKDAY;
    }

    return group;
};

export const getHeading = (date?: string | Date, group?: string) => {
    if (!date || !group) {
        return null;
    }

    switch (group) {
        case GROUPS.TODAY:
            return <FormattedMessage {...messages.versionsToday} />; // Today
        case GROUPS.YESTERDAY:
            return <FormattedMessage {...messages.versionsYesterday} />; // Yesterday
        case GROUPS.WEEKDAY:
            return <FormattedDate value={date} weekday="long" />; // Monday
        case GROUPS.PRIOR_WEEK:
            return <FormattedMessage {...messages.versionsPriorWeek} />; // Last Week
        case GROUPS.THIS_MONTH:
            return <FormattedMessage {...messages.versionsThisMonth} />; // This Month
        case GROUPS.PRIOR_MONTH:
            return <FormattedDate value={date} month="long" />; // January
        case GROUPS.PRIOR_YEAR:
            return <FormattedDate value={date} year="numeric" />; // 2018
        default:
            return null;
    }
};

const VersionsGroup = ({ versionGroup, versions, ...rest }: Props) => {
    const { created_at: groupDate } = versions[0];

    return (
        <section className="bcs-VersionsGroup">
            <h1 className="bcs-VersionsGroup-heading">{getHeading(groupDate, versionGroup)}</h1>

            <VersionsList versions={versions} {...rest} />
        </section>
    );
};

export default VersionsGroup;
