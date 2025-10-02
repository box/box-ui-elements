/**
 * 
 * @file Activity feed sidebar filter component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import PlainButton from '../../components/plain-button';
import messages from './messages';
import { ACTIVITY_FILTER_OPTION_ALL, ACTIVITY_FILTER_OPTION_RESOLVED, ACTIVITY_FILTER_OPTION_TASKS, ACTIVITY_FILTER_OPTION_UNRESOLVED, COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED, FEED_ITEM_TYPE_TASK } from '../../constants';
import { Menu, SelectMenuItem } from '../../components/menu';
import './ActivitySidebarFilter.scss';
const filterOptionToStatus = {
  [ACTIVITY_FILTER_OPTION_ALL]: ACTIVITY_FILTER_OPTION_ALL,
  [ACTIVITY_FILTER_OPTION_UNRESOLVED]: COMMENT_STATUS_OPEN,
  [ACTIVITY_FILTER_OPTION_RESOLVED]: COMMENT_STATUS_RESOLVED,
  [ACTIVITY_FILTER_OPTION_TASKS]: FEED_ITEM_TYPE_TASK
};
function ActivitySidebarFilter({
  activityFilterOptions,
  feedItemType = ACTIVITY_FILTER_OPTION_ALL,
  onFeedItemTypeClick
}) {
  const hasOnlyCommentActivity = options => {
    const commentActivityFilterOptions = [ACTIVITY_FILTER_OPTION_ALL, ACTIVITY_FILTER_OPTION_RESOLVED, ACTIVITY_FILTER_OPTION_UNRESOLVED];
    return options.every(option => commentActivityFilterOptions.includes(option));
  };

  // The message for all activty is based on whether only comments are in the activityFilterOptions prop
  const allFilterMessage = hasOnlyCommentActivity(activityFilterOptions) ? messages.activitySidebarFilterOptionAllComments : messages.activitySidebarFilterOptionAllActivity;
  const statusMap = {
    [ACTIVITY_FILTER_OPTION_ALL]: {
      msg: allFilterMessage,
      val: ACTIVITY_FILTER_OPTION_ALL
    },
    [COMMENT_STATUS_OPEN]: {
      msg: messages.activitySidebarFilterOptionOpen,
      val: COMMENT_STATUS_OPEN
    },
    [COMMENT_STATUS_RESOLVED]: {
      msg: messages.activitySidebarFilterOptionResolved,
      val: COMMENT_STATUS_RESOLVED
    },
    [FEED_ITEM_TYPE_TASK]: {
      msg: messages.activitySidebarFilterOptionTasks,
      val: FEED_ITEM_TYPE_TASK
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivitySidebarFilter"
  }, /*#__PURE__*/React.createElement(DropdownMenu, {
    className: "bcs-ActivitySidebarFilter-dropdownMenu",
    constrainToWindow: true
  }, /*#__PURE__*/React.createElement(PlainButton, {
    type: "button"
  }, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(FormattedMessage, statusMap[feedItemType].msg))), /*#__PURE__*/React.createElement(Menu, null, activityFilterOptions.map(filterOption => {
    const status = filterOptionToStatus[filterOption];
    return /*#__PURE__*/React.createElement(SelectMenuItem, {
      key: status,
      isSelected: status === feedItemType,
      onClick: () => onFeedItemTypeClick(statusMap[status].val)
    }, /*#__PURE__*/React.createElement(FormattedMessage, statusMap[status].msg));
  }))));
}
export default ActivitySidebarFilter;
//# sourceMappingURL=ActivitySidebarFilter.js.map