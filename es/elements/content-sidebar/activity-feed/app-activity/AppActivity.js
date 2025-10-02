function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file AppActivity component
 */

import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import { FormattedMessage, injectIntl } from 'react-intl';
import ActivityCard from '../ActivityCard';
import ActivityTimestamp from '../common/activity-timestamp';
import DeleteConfirmation from '../common/delete-confirmation';
import IconTrash from '../../../../icons/general/IconTrash';
import Media from '../../../../components/media';
import messages from './messages';
import { bdlGray80 } from '../../../../styles/variables';
import { Link } from '../../../../components/link';
import { MenuItem } from '../../../../components/menu';
import './AppActivity.scss';
function mapActivityNodes(node) {
  const {
    dataset = {},
    href = '#',
    tagName,
    textContent
  } = node;
  switch (tagName) {
    case 'A':
      return /*#__PURE__*/React.createElement(Link, {
        href: href,
        "data-resin-target": dataset.resinTarget,
        "data-resin-action": dataset.resinAction,
        key: `app_actvity_link_${href}`,
        rel: "roreferrer noopener",
        className: "bcs-AppActivity-link",
        target: "_blank"
      }, textContent);
    default:
      return textContent;
  }
}
class AppActivity extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "parser", new DOMParser());
    _defineProperty(this, "state", {
      isConfirmingDelete: false
    });
    _defineProperty(this, "handleDeleteCancel", () => {
      this.setState({
        isConfirmingDelete: false
      });
    });
    _defineProperty(this, "handleDeleteClick", () => {
      this.setState({
        isConfirmingDelete: true
      });
    });
    _defineProperty(this, "handleDeleteConfirm", () => {
      const {
        id,
        onDelete,
        permissions
      } = this.props;
      onDelete({
        id,
        permissions
      });
    });
    _defineProperty(this, "parseActivity", () => {
      const {
        rendered_text: renderedText
      } = this.props;
      const doc = this.parser.parseFromString(renderedText, 'text/html');
      if (!doc) {
        return [];
      }
      const childNodes = getProp(doc, 'body.childNodes', []);
      return Array.from(childNodes);
    });
  }
  render() {
    const {
      activity_template: {
        id: templateId
      },
      app: {
        name,
        icon_url
      },
      created_at: createdAt,
      created_by: createdBy,
      currentUser,
      error,
      intl,
      isPending,
      permissions
    } = this.props;
    const canDelete = getProp(permissions, 'can_delete', false) || currentUser && currentUser.id === createdBy.id;
    const createdAtTimestamp = new Date(createdAt).getTime();
    const isMenuVisible = canDelete && !isPending;
    const {
      isConfirmingDelete
    } = this.state;
    return /*#__PURE__*/React.createElement(ActivityCard, {
      className: "bcs-AppActivity",
      "data-resin-target": "loaded",
      "data-resin-feature": `appActivityCard${templateId}`
    }, /*#__PURE__*/React.createElement(Media, {
      className: classNames({
        'bcs-is-pending': isPending || error
      })
    }, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement("img", {
      className: "bcs-AppActivity-icon",
      alt: intl.formatMessage(messages.appActivityAltIcon, {
        appActivityName: name
      }),
      src: icon_url
    })), /*#__PURE__*/React.createElement(Media.Body, {
      className: "bcs-AppActivity-body"
    }, isMenuVisible && /*#__PURE__*/React.createElement(TetherComponent, {
      attachment: "top right",
      className: "bcs-AppActivity-confirm",
      constraints: [{
        to: 'scrollParent',
        attachment: 'together'
      }],
      targetAttachment: "bottom right",
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref,
        style: {
          display: 'inline-block'
        }
      }, /*#__PURE__*/React.createElement(Media.Menu, {
        isDisabled: isConfirmingDelete
      }, /*#__PURE__*/React.createElement(MenuItem, {
        onClick: this.handleDeleteClick
      }, /*#__PURE__*/React.createElement(IconTrash, {
        color: bdlGray80
      }), /*#__PURE__*/React.createElement(FormattedMessage, messages.appActivityDeleteMenuItem)))),
      renderElement: ref => {
        return isConfirmingDelete ? /*#__PURE__*/React.createElement("div", {
          ref: ref
        }, /*#__PURE__*/React.createElement(DeleteConfirmation, {
          isOpen: isConfirmingDelete,
          message: messages.appActivityDeletePrompt,
          onDeleteCancel: this.handleDeleteCancel,
          onDeleteConfirm: this.handleDeleteConfirm
        })) : null;
      }
    }), /*#__PURE__*/React.createElement("figcaption", {
      className: "bcs-AppActivity-headline"
    }, name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ActivityTimestamp, {
      date: createdAtTimestamp
    })), this.parseActivity().map(mapActivityNodes))));
  }
}
_defineProperty(AppActivity, "defaultProps", {
  onDelete: noop,
  permissions: {}
});
export default injectIntl(AppActivity);
//# sourceMappingURL=AppActivity.js.map