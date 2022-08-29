/**
 * @flow
 * @file Activity feed sidebar filter component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, MenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import Checkmark16 from '../../icon/fill/Checkmark16';
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
                <PlainButton>
                    <MenuToggle>
                        <FormattedMessage {...selectedMsg} />
                    </MenuToggle>
                </PlainButton>
                <Menu>
                    {options.map(({ key, msg, status }) => (
                        <MenuItem
                            isSelected={status === feedItemStatus}
                            key={key}
                            onClick={() => onFeedItemStatusClick(status)}
                        >
                            {status === feedItemStatus && <Checkmark16 />}
                            <FormattedMessage {...msg} />
                        </MenuItem>
                    ))}
                </Menu>
            </DropdownMenu>
        </div>
    );
}

export default ActivitySidebarFilter;
