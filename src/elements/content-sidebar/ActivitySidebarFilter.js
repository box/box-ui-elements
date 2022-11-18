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
import { COMMENT_STATUS_OPEN } from '../../constants';
import { Menu, SelectMenuItem } from '../../components/menu';
import type { FeedItemStatus } from '../../common/types/feed';
import './ActivitySidebarFilter.scss';

type ActivitySidebarFilterProps = {
    feedItemStatus?: FeedItemStatus,
    onFeedItemStatusClick: (status?: FeedItemStatus) => void,
};

const ACTIVITY_FEED_ITEM_ALL = 'all';
const ACTIVITY_FEED_ITEM_OPEN = COMMENT_STATUS_OPEN;

const statuses = [ACTIVITY_FEED_ITEM_ALL, ACTIVITY_FEED_ITEM_OPEN];
const statusMap = {
    [ACTIVITY_FEED_ITEM_ALL]: { msg: messages.activitySidebarFilterOptionAll, val: undefined },
    [ACTIVITY_FEED_ITEM_OPEN]: { msg: messages.activitySidebarFilterOptionOpen, val: COMMENT_STATUS_OPEN },
};

function ActivitySidebarFilter({
    feedItemStatus = ACTIVITY_FEED_ITEM_ALL,
    onFeedItemStatusClick,
}: ActivitySidebarFilterProps) {
    return (
        <div className="bcs-ActivitySidebarFilter">
            <DropdownMenu className="bcs-ActivitySidebarFilter-dropdownMenu" constrainToWindow>
                <PlainButton type="button">
                    <MenuToggle>
                        <FormattedMessage {...statusMap[feedItemStatus].msg} />
                    </MenuToggle>
                </PlainButton>
                <Menu>
                    {statuses.map(status => (
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
