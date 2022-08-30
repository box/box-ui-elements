/**
 * @flow
 * @file Activity feed sidebar filter component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../constants';
import messages from './messages';
import type { FeedItemStatus } from '../../common/types/feed';
import './ActivitySidebarFilter.scss';

type ActivitySidebarFilterProps = {
    feedItemStatus?: FeedItemStatus,
    onFeedItemStatusClick: (status?: FeedItemStatus) => void,
};

function ActivitySidebarFilter({ feedItemStatus, onFeedItemStatusClick }: ActivitySidebarFilterProps) {
    const options: Array<{ key: string, msg: MessageDescriptor, status?: FeedItemStatus }> = [
        { key: 'all', msg: messages.activitySidebarFilterOptionAll },
        { key: 'open', msg: messages.activitySidebarFilterOptionOpen, status: COMMENT_STATUS_OPEN },
        { key: 'resolved', msg: messages.activitySidebarFilterOptionResolved, status: COMMENT_STATUS_RESOLVED },
    ];
    let selectedMsg: MessageDescriptor = messages.activitySidebarFilterOptionAll;
    if (feedItemStatus) {
        if (feedItemStatus === COMMENT_STATUS_OPEN) {
            selectedMsg = messages.activitySidebarFilterOptionOpen;
        } else if (feedItemStatus === COMMENT_STATUS_RESOLVED) {
            selectedMsg = messages.activitySidebarFilterOptionResolved;
        }
    }

    return (
        <div className="bcs-ActivitySidebarFilter">
            <DropdownMenu className="bcs-ActivitySidebarFilter-dropdownMenu" constrainToWindow>
                <PlainButton type="button">
                    <MenuToggle>
                        <FormattedMessage {...selectedMsg} />
                    </MenuToggle>
                </PlainButton>
                <Menu>
                    {options.map(({ key, msg, status }) => (
                        <SelectMenuItem
                            isSelected={status === feedItemStatus}
                            key={key}
                            onClick={() => onFeedItemStatusClick(status)}
                        >
                            <FormattedMessage {...msg} />
                        </SelectMenuItem>
                    ))}
                </Menu>
            </DropdownMenu>
        </div>
    );
}

export default ActivitySidebarFilter;
