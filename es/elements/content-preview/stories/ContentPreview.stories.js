function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ContentPreview from '../ContentPreview';
export const basic = {};
export const withAnnotations = {
  args: {
    contentSidebarProps: {
      detailsSidebarProps: {
        hasAccessStats: true,
        hasClassification: true,
        hasNotices: true,
        hasProperties: true,
        hasRetentionPolicy: true,
        hasVersions: true
      },
      features: global.FEATURE_FLAGS,
      hasActivityFeed: true,
      hasMetadata: true,
      hasSkills: true,
      hasVersions: true
    },
    showAnnotations: true
  }
};
export const withSidebar = {
  args: {
    contentSidebarProps: {
      detailsSidebarProps: {
        hasAccessStats: true,
        hasClassification: true,
        hasNotices: true,
        hasProperties: true,
        hasRetentionPolicy: true,
        hasVersions: true
      },
      features: global.FEATURE_FLAGS,
      hasActivityFeed: true,
      hasMetadata: true,
      hasSkills: true,
      hasVersions: true
    }
  }
};
export const withBoxAI = {
  args: {
    contentAnswersProps: {
      show: true,
      isCitationsEnabled: true,
      isMarkdownEnabled: true
    }
  }
};
export default {
  title: 'Elements/ContentPreview',
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
//# sourceMappingURL=ContentPreview.stories.js.map