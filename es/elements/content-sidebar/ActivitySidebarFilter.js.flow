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
    ACTIVITY_FILTER_OPTION_ALL,
    ACTIVITY_FILTER_OPTION_RESOLVED,
    ACTIVITY_FILTER_OPTION_TASKS,
    ACTIVITY_FILTER_OPTION_UNRESOLVED,
    COMMENT_STATUS_OPEN,
    COMMENT_STATUS_RESOLVED,
    FEED_ITEM_TYPE_TASK,
} from '../../constants';
import { Menu, SelectMenuItem } from '../../components/menu';
import type { ActivityFilterItemType, ActivityFilterOption } from '../../common/types/feed';
import './ActivitySidebarFilter.scss';

type ActivitySidebarFilterProps = {
    activityFilterOptions: ActivityFilterOption[],
    feedItemType?: ActivityFilterItemType,
    onFeedItemTypeClick: (status?: ActivityFilterItemType) => void,
};

const filterOptionToStatus = {
    [ACTIVITY_FILTER_OPTION_ALL]: ACTIVITY_FILTER_OPTION_ALL,
    [ACTIVITY_FILTER_OPTION_UNRESOLVED]: COMMENT_STATUS_OPEN,
    [ACTIVITY_FILTER_OPTION_RESOLVED]: COMMENT_STATUS_RESOLVED,
    [ACTIVITY_FILTER_OPTION_TASKS]: FEED_ITEM_TYPE_TASK,
};

function ActivitySidebarFilter({
    activityFilterOptions,
    feedItemType = ACTIVITY_FILTER_OPTION_ALL,
    onFeedItemTypeClick,
}: ActivitySidebarFilterProps) {
    const hasOnlyCommentActivity = (options: ActivityFilterOption[]): boolean => {
        const commentActivityFilterOptions = [
            ACTIVITY_FILTER_OPTION_ALL,
            ACTIVITY_FILTER_OPTION_RESOLVED,
            ACTIVITY_FILTER_OPTION_UNRESOLVED,
        ];
        return options.every(option => commentActivityFilterOptions.includes(option));
    };

    // The message for all activty is based on whether only comments are in the activityFilterOptions prop
    const allFilterMessage = hasOnlyCommentActivity(activityFilterOptions)
        ? messages.activitySidebarFilterOptionAllComments
        : messages.activitySidebarFilterOptionAllActivity;

    const statusMap = {
        [ACTIVITY_FILTER_OPTION_ALL]: {
            msg: allFilterMessage,
            val: ACTIVITY_FILTER_OPTION_ALL,
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
                        <FormattedMessage {...statusMap[feedItemType].msg} />
                    </MenuToggle>
                </PlainButton>
                <Menu>
                    {activityFilterOptions.map(filterOption => {
                        const status = filterOptionToStatus[filterOption];
                        return (
                            <SelectMenuItem
                                key={status}
                                isSelected={status === feedItemType}
                                onClick={() => onFeedItemTypeClick(statusMap[status].val)}
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
