function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import Button from '../../../components/button/Button';
import ContentSharing from '../ContentSharing';
export const basic = {};
export const withCustomButton = {
  args: {
    displayInModal: true,
    customButton: /*#__PURE__*/React.createElement(Button, null, "\u273F Launch ContentSharing \u273F")
  }
};
export const withContentSharingV2Enabled = {
  args: {
    children: /*#__PURE__*/React.createElement("button", null, "Open Unified Share Modal"),
    features: _objectSpread(_objectSpread({}, global.FEATURE_FLAGS), {}, {
      contentSharingV2: true
    })
  }
};
export default {
  title: 'Elements/ContentSharing',
  component: ContentSharing,
  args: {
    apiHost: DEFAULT_HOSTNAME_API,
    config: {
      showEmailSharedLinkForm: false,
      showInviteCollaboratorMessageSection: false
    },
    displayInModal: false,
    itemType: TYPE_FILE,
    itemID: global.FILE_ID,
    token: global.TOKEN
  },
  argTypes: {
    itemType: {
      options: [TYPE_FILE, TYPE_FOLDER],
      control: {
        type: 'select'
      }
    }
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  }
};
//# sourceMappingURL=ContentSharing.stories.js.map