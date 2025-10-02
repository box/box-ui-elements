function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import MetadataDefaultBadge from '../../../icons/badges/MetadataDefaultBadge';
import MetadataActiveBadge from '../../../icons/badges/MetadataActiveBadge';
import TemplateDropdown from '../../metadata-instance-editor/TemplateDropdown';
import Button from '../../../components/button/Button';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import messages from '../messages';
import LoadingIndicator from '../../../components/loading-indicator';
class TemplateButton extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isTemplateMenuOpen: false
    });
    _defineProperty(this, "toggleTemplateDropdownButton", () => {
      this.setState({
        isTemplateMenuOpen: !this.state.isTemplateMenuOpen
      });
    });
    _defineProperty(this, "updateActiveTemplate", template => {
      const {
        onTemplateChange
      } = this.props;
      if (onTemplateChange) {
        onTemplateChange(template);
      }
    });
    _defineProperty(this, "renderEntryButton", () => {
      const {
        templates,
        activeTemplate
      } = this.props;
      let icon;
      let text;
      const isLoadingTemplates = !templates;
      const hasTemplates = templates && templates.length > 0;
      if (isLoadingTemplates) {
        icon = /*#__PURE__*/React.createElement(LoadingIndicator, {
          className: "loading-indicator"
        });
        text = /*#__PURE__*/React.createElement(FormattedMessage, messages.templatesLoadingButtonText);
      } else if (!hasTemplates) {
        text = /*#__PURE__*/React.createElement(FormattedMessage, messages.noTemplatesText);
      } else if (activeTemplate) {
        icon = /*#__PURE__*/React.createElement(MetadataActiveBadge, null);
        text = activeTemplate.displayName;
      } else if (!activeTemplate) {
        icon = /*#__PURE__*/React.createElement(MetadataDefaultBadge, null);
        text = /*#__PURE__*/React.createElement(FormattedMessage, messages.templatesButtonText);
      }
      const buttonClasses = classNames('query-bar-button', {
        'is-active': activeTemplate
      });
      return /*#__PURE__*/React.createElement(Button, {
        className: buttonClasses,
        isDisabled: !templates || templates.length === 0,
        type: "button",
        onClick: this.toggleTemplateDropdownButton
      }, /*#__PURE__*/React.createElement(MenuToggle, null, icon, /*#__PURE__*/React.createElement("span", {
        className: "button-label"
      }, text)));
    });
    _defineProperty(this, "renderTitle", () => /*#__PURE__*/React.createElement("div", {
      className: "template-dropdown-list-title"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataViewTemplateListHeaderTitle)));
  }
  render() {
    const {
      activeTemplate,
      templates,
      usedTemplates
    } = this.props;
    return /*#__PURE__*/React.createElement(TemplateDropdown, {
      className: "query-bar-template-dropdown-flyout",
      defaultTemplateIcon: /*#__PURE__*/React.createElement(MetadataDefaultBadge, {
        className: "template-list-item-badge"
      }),
      title: this.renderTitle(),
      onAdd: this.updateActiveTemplate,
      activeTemplate: activeTemplate,
      activeTemplateIcon: /*#__PURE__*/React.createElement(MetadataActiveBadge, {
        className: "template-list-item-badge"
      }),
      templates: templates || [],
      usedTemplates: usedTemplates,
      entryButton: this.renderEntryButton()
    });
  }
}
_defineProperty(TemplateButton, "defaultProps", {
  usedTemplates: []
});
export default TemplateButton;
//# sourceMappingURL=TemplateButton.js.map