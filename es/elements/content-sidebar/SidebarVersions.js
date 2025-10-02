/**
 * 
 * @file Versions sidebar component
 * @author Box
 */

import * as React from 'react';
import VersionHistoryLink from '../../features/item-details/VersionHistoryLink';
import { DETAILS_TARGETS } from '../common/interactionTargets';
import { isBoxNote } from '../../utils/file';
import './SidebarVersions.scss';
const SidebarVersions = ({
  onVersionHistoryClick,
  file
}) => {
  const {
    version_number
  } = file;
  const versionNumber = parseInt(version_number, 10);
  if (isBoxNote(file) || !versionNumber || versionNumber <= 1) {
    return null;
  }
  return /*#__PURE__*/React.createElement(VersionHistoryLink, {
    className: "bcs-SidebarVersions",
    "data-resin-target": DETAILS_TARGETS.VERSION_HISTORY,
    "data-testid": DETAILS_TARGETS.VERSION_HISTORY,
    onClick: onVersionHistoryClick,
    versionCount: versionNumber
  });
};
export default SidebarVersions;
//# sourceMappingURL=SidebarVersions.js.map