/**
 * 
 * @file Versions sidebar component
 * @author Box
 */

import * as React from 'react';
import isFinite from 'lodash/isFinite';
import { injectIntl, FormattedMessage } from 'react-intl';
import AccessStats from '../../features/access-stats/AccessStats';
import messages from '../common/messages';
import { INTERACTION_TARGET, SECTION_TARGETS, DETAILS_TARGETS } from '../common/interactionTargets';
import { isBoxNote } from '../../utils/file';
import SidebarSection from './SidebarSection';
import withErrorHandling from './withErrorHandling';
const SidebarAccessStats = ({
  onAccessStatsClick,
  accessStats = {
    comment_count: undefined,
    download_count: undefined,
    edit_count: undefined,
    has_count_overflowed: false,
    preview_count: undefined
  },
  file,
  error,
  intl
}) => {
  const {
    preview_count,
    comment_count,
    download_count,
    edit_count
  } = accessStats;
  if (!isFinite(preview_count) && !isFinite(comment_count) && !isFinite(download_count) && !isFinite(edit_count) && !error) {
    return null;
  }
  const errorMessage = error ? intl.formatMessage(error) : undefined;
  return /*#__PURE__*/React.createElement(SidebarSection, {
    interactionTarget: SECTION_TARGETS.ACCESS_STATS,
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarAccessStats)
  }, /*#__PURE__*/React.createElement(AccessStats, {
    errorMessage: errorMessage,
    commentCount: comment_count,
    commentStatButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.COMMENTS
    },
    downloadCount: download_count,
    downloadStatButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.DOWNLOADS
    },
    previewCount: preview_count,
    previewStatButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.PREVIEWS
    },
    viewStatButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.VIEWS
    },
    editCount: edit_count,
    editStatButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.EDITS
    },
    openAccessStatsModal: onAccessStatsClick,
    isBoxNote: isBoxNote(file),
    viewMoreButtonProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.VIEW_DETAILS
    }
  }));
};
export { SidebarAccessStats as SidebarAccessStatsComponent };
export default withErrorHandling(injectIntl(SidebarAccessStats));
//# sourceMappingURL=SidebarAccessStats.js.map