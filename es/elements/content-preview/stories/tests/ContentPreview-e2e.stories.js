function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ContentPreview from '../../ContentPreview';
import { testFileIds } from '../../../../../test/support/constants';
export const fileVersion = {
  args: {
    collection: Object.values(testFileIds),
    contentSidebarProps: {
      hasActivityFeed: true,
      hasSkills: true,
      hasVersions: true,
      detailsSidebarProps: {
        hasAccessStats: true,
        hasClassification: true,
        hasNotices: true,
        hasProperties: true,
        hasRetentionPolicy: true,
        hasVersions: true
      }
    },
    fileId: testFileIds.FILE_ID_DOC_VERSIONED
  }
};
export const noSidebar = {
  args: {
    fileId: testFileIds.FILE_ID_SKILLS
  }
};
export const withSidebar = {
  args: {
    collection: Object.values(testFileIds),
    contentSidebarProps: {
      hasActivityFeed: true,
      hasSkills: true,
      detailsSidebarProps: {
        hasAccessStats: true,
        hasClassification: true,
        hasNotices: true,
        hasProperties: true,
        hasRetentionPolicy: true,
        hasVersions: true
      }
    },
    fileId: testFileIds.FILE_ID_SKILLS
  }
};
export default {
  title: 'Elements/ContentPreview/tests/e2e',
  component: ContentPreview,
  render: _ref => {
    let args = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
    return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(ContentPreview, _extends({
      key: `${args.fileId}-${args.token}`
    }, args)));
  },
  args: {
    features: global.FEATURE_FLAGS,
    fileId: global.FILE_ID,
    hasHeader: true,
    token: global.TOKEN
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  }
};
//# sourceMappingURL=ContentPreview-e2e.stories.js.map