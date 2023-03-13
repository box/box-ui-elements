/**
 * @flow
 * @file Activity feed sidebar filter component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import PlainButton from '../../components/plain-button';
import messages from './messages';
import {
    ACTIVITY_FEED_ITEM_ALL,
    ACTIVITY_FEED_ITEM_OPEN,
    ACTIVITY_FEED_ITEM_RESOLVED,
    ACTIVITY_FEED_ITEM_TASKS,
    ACTIVITY_FILTER_TITLE_ALL_COMMENTS,
    COMMENT_STATUS_OPEN,
    COMMENT_STATUS_RESOLVED,
} from '../../constants';
import { Menu, SelectMenuItem } from '../../components/menu';
import type { ActivityFilterAllTitle, ActivityFilterStatus } from '../../common/types/feed';
import './ActivitySidebarFilter.scss';

type ActivitySidebarFilterProps = {
    activityFilterAllTitle?: ActivityFilterAllTitle,
    activityFilterOptions?: ActivityFilterStatus[],
    feedItemStatus?: ActivityFilterStatus,
    onFeedItemStatusClick: (status?: ActivityFilterStatus) => void,
};

function ActivitySidebarFilter({
    activityFilterOptions = [ACTIVITY_FEED_ITEM_ALL, ACTIVITY_FEED_ITEM_OPEN],
    activityFilterAllTitle = ACTIVITY_FILTER_TITLE_ALL_COMMENTS,
    feedItemStatus = ACTIVITY_FEED_ITEM_ALL,
    onFeedItemStatusClick,
}: ActivitySidebarFilterProps) {
    const statusMap = {
        [ACTIVITY_FEED_ITEM_ALL]: {
            msg:
                activityFilterAllTitle === ACTIVITY_FILTER_TITLE_ALL_COMMENTS
                    ? messages.activitySidebarFilterOptionAll
                    : messages.activitySidebarFilterOptionAllActivity,
            val: undefined,
        },
        [ACTIVITY_FEED_ITEM_OPEN]: { msg: messages.activitySidebarFilterOptionOpen, val: COMMENT_STATUS_OPEN },
        [ACTIVITY_FEED_ITEM_RESOLVED]: {
            msg: messages.activitySidebarFilterOptionResolved,
            val: COMMENT_STATUS_RESOLVED,
        },
        [ACTIVITY_FEED_ITEM_TASKS]: {
            msg: messages.activitySidebarFilterOptionTasks,
            val: ACTIVITY_FEED_ITEM_TASKS,
        },
    };

    return (
        <div className="bcs-ActivitySidebarFilter">
            <DropdownMenu className="bcs-ActivitySidebarFilter-dropdownMenu" constrainToWindow>
                <PlainButton type="button">
                    <MenuToggle>
                        <FormattedMessage {...statusMap[feedItemStatus].msg} />
                    </MenuToggle>
                </PlainButton>
                <Menu>
                    {activityFilterOptions.map(status => (
                        <SelectMenuItem
                            key={status}
                            isSelected={status === feedItemStatus}
                            onClick={() => onFeedItemStatusClick(statusMap[status].val)}
                        >
                            <FormattedMessage {...statusMap[status].msg} />
                        </SelectMenuItem>
                    ))}
                </Menu>
            </DropdownMenu>
        </div>
    );
}

export default ActivitySidebarFilter;
