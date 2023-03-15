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
    COMMENT_STATUS_OPEN,
    COMMENT_STATUS_RESOLVED,
    FEED_ITEM_TYPE_TASK,
} from '../../constants';
import { Menu, SelectMenuItem } from '../../components/menu';
import type { ActivityFilterOption, ActivityFilterStatus } from '../../common/types/feed';
import './ActivitySidebarFilter.scss';

type ActivitySidebarFilterProps = {
    activityFilterOptions?: ActivityFilterOption[],
    feedItemStatus?: ActivityFilterStatus,
    onFeedItemStatusClick: (status?: ActivityFilterStatus) => void,
};

const filterOptionToStatus = {
    [ACTIVITY_FEED_ITEM_ALL]: ACTIVITY_FEED_ITEM_ALL,
    [ACTIVITY_FEED_ITEM_OPEN]: COMMENT_STATUS_OPEN,
    [ACTIVITY_FEED_ITEM_RESOLVED]: COMMENT_STATUS_RESOLVED,
    [ACTIVITY_FEED_ITEM_TASKS]: FEED_ITEM_TYPE_TASK,
};

function ActivitySidebarFilter({
    activityFilterOptions = [ACTIVITY_FEED_ITEM_ALL, ACTIVITY_FEED_ITEM_OPEN],
    feedItemStatus = ACTIVITY_FEED_ITEM_ALL,
    onFeedItemStatusClick,
}: ActivitySidebarFilterProps) {
    const isCommentsOnlyFilter = !activityFilterOptions.includes(ACTIVITY_FEED_ITEM_TASKS);

    const statusMap = {
        [ACTIVITY_FEED_ITEM_ALL]: {
            msg: isCommentsOnlyFilter
                ? messages.activitySidebarFilterOptionAllComments
                : messages.activitySidebarFilterOptionAllActivity,
            val: undefined,
        },
        [COMMENT_STATUS_OPEN]: { msg: messages.activitySidebarFilterOptionOpen, val: COMMENT_STATUS_OPEN },
        [COMMENT_STATUS_RESOLVED]: {
            msg: messages.activitySidebarFilterOptionResolved,
            val: COMMENT_STATUS_RESOLVED,
        },
        [FEED_ITEM_TYPE_TASK]: {
            msg: messages.activitySidebarFilterOptionTasks,
            val: FEED_ITEM_TYPE_TASK,
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
                    {activityFilterOptions.map(filterOption => {
                        const status = filterOptionToStatus[filterOption];
                        return (
                            <SelectMenuItem
                                key={status}
                                isSelected={status === feedItemStatus}
                                onClick={() => onFeedItemStatusClick(statusMap[status].val)}
                            >
                                <FormattedMessage {...statusMap[status].msg} />
                            </SelectMenuItem>
                        );
                    })}
                </Menu>
            </DropdownMenu>
        </div>
    );
}

export default ActivitySidebarFilter;
