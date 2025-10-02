function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { action } from 'storybook/actions';
import CommentForm, { CommentFormUnwrapped } from '../CommentForm';
const intlFake = {
  formatMessage: message => message.defaultMessage
};
const defaultUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com'
};
const defaultFile = {
  id: 'file_123',
  name: 'test-file.pdf',
  extension: 'pdf',
  type: 'file'
};
const getTemplate = customProps => props => /*#__PURE__*/React.createElement(CommentFormUnwrapped, _extends({
  user: defaultUser,
  file: defaultFile,
  intl: intlFake,
  onCancel: action('onCancel'),
  createComment: action('createComment'),
  updateComment: action('updateComment'),
  onSubmit: action('onSubmit'),
  onFocus: action('onFocus'),
  getMentionWithQuery: action('getMentionWithQuery')
}, props, customProps));
export const Default = getTemplate({});
export const Open = getTemplate({
  isOpen: true
});
export const Editing = getTemplate({
  isOpen: true,
  isEditing: true,
  entityId: 'comment_123',
  tagged_message: 'This is an existing comment'
});
export const Disabled = getTemplate({
  isOpen: true,
  isDisabled: true
});
export const VideoFile = () => {
  const features = {
    activityFeed: {
      timestampedComments: {
        enabled: true
      }
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bp-media-dash",
    style: {
      width: '100px',
      height: '100px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("video", {
    src: "//cdn03.boxcdn.net/sites/default/files/homepage/v2/images/hero/run/laptop-screen-1680-v2@1x.mp4",
    controls: true,
    style: {
      width: '100%',
      height: '100%'
    }
  })), /*#__PURE__*/React.createElement(CommentFormUnwrapped, {
    intl: intlFake,
    user: defaultUser,
    file: _objectSpread(_objectSpread({}, defaultFile), {}, {
      extension: 'mp4'
    }),
    features: features,
    isOpen: true,
    onCancel: action('onCancel'),
    createComment: action('createComment'),
    updateComment: action('updateComment'),
    onSubmit: action('onSubmit'),
    onFocus: action('onFocus'),
    getMentionWithQuery: action('getMentionWithQuery')
  }));
};
export default {
  title: 'Components/CommentForm',
  component: CommentForm,
  parameters: {
    docs: {
      description: {
        component: 'A form component for creating and editing comments in the activity feed.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: {
        type: 'boolean'
      },
      description: 'Whether the comment form is open'
    },
    isEditing: {
      control: {
        type: 'boolean'
      },
      description: 'Whether the form is in editing mode'
    },
    isDisabled: {
      control: {
        type: 'boolean'
      },
      description: 'Whether the form is disabled'
    },
    features: {
      control: {
        type: 'object'
      },
      description: 'Features object'
    },
    file: {
      control: {
        type: 'object'
      },
      description: 'File object'
    },
    tagged_message: {
      control: {
        type: 'text'
      },
      description: 'Initial message content for editing'
    },
    placeholder: {
      control: {
        type: 'text'
      },
      description: 'Placeholder text for the comment input'
    },
    shouldFocusOnOpen: {
      control: {
        type: 'boolean'
      },
      description: 'Whether to focus the input when opened'
    },
    showTip: {
      control: {
        type: 'boolean'
      },
      description: 'Whether to show a tip'
    },
    onCancel: {
      action: 'onCancel',
      description: 'Callback when cancel is clicked'
    },
    createComment: {
      action: 'createComment',
      description: 'Callback to create a new comment'
    },
    updateComment: {
      action: 'updateComment',
      description: 'Callback to update an existing comment'
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Callback when form is submitted'
    },
    onFocus: {
      action: 'onFocus',
      description: 'Callback when input is focused'
    },
    getMentionWithQuery: {
      action: 'getMentionWithQuery',
      description: 'Callback to get mentions based on query'
    }
  }
};
//# sourceMappingURL=CommentForm.stories.js.map