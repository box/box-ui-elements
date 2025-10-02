const _excluded = ["intl", "versions"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Versions Menu component
 * @author Box
 */

import * as React from 'react';
import last from 'lodash/last';
import { injectIntl } from 'react-intl';
import * as util from '../../../utils/datetime';
import messages from './messages';
import VersionsGroup from './VersionsGroup';
import './VersionsMenu.scss';
const getHeading = ({
  intl,
  version
}) => {
  const {
    created_at: createdAt
  } = version;
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
    heading = intl.formatDate(createdAt, {
      year: 'numeric'
    }); // 2018
  } else if (!util.isCurrentMonth(createdAtDate)) {
    heading = intl.formatDate(createdAt, {
      month: 'long'
    }); // January
  } else if (createdAtDate.getDate() <= currentSunday - 7) {
    heading = intl.formatMessage(messages.versionsThisMonth); // This Month
  } else if (createdAtDate.getDate() <= currentSunday) {
    heading = intl.formatMessage(messages.versionsPriorWeek); // Last Week
  } else {
    heading = intl.formatDate(createdAt, {
      weekday: 'long'
    }); // Monday
  }
  return heading;
};
const VersionsMenu = /*#__PURE__*/React.memo(_ref => {
  let {
      intl,
      versions
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    id: currentId
  } = versions[0] || {};

  // Build an ordered set of groups with headings based on the original order of the versions array
  const versionGroups = versions.reduce((groups, version) => {
    const currentGroup = last(groups);
    const groupHeading = getHeading({
      intl,
      version
    });

    // Push a new group if there are no groups or if the heading has changed
    if (!currentGroup || currentGroup.groupHeading !== groupHeading) {
      groups.push({
        groupHeading,
        groupVersions: []
      });
    }

    // Push the sorted version to the newest group's versions collection
    last(groups).groupVersions.push(version);
    return groups;
  }, []);
  return /*#__PURE__*/React.createElement("ul", {
    className: "bcs-VersionsMenu"
  }, versionGroups.map(({
    groupHeading,
    groupVersions
  }) => /*#__PURE__*/React.createElement("li", {
    className: "bcs-VersionsMenu-item",
    key: groupHeading
  }, /*#__PURE__*/React.createElement(VersionsGroup, _extends({
    currentId: currentId,
    heading: groupHeading,
    versions: groupVersions
  }, rest)))));
});
export default injectIntl(VersionsMenu);
//# sourceMappingURL=VersionsMenu.js.map