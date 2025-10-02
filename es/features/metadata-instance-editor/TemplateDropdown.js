function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { FormattedMessage, injectIntl } from 'react-intl';
import DatalistItem from '../../components/datalist-item';
import SelectorDropdown from '../../components/selector-dropdown';
import SearchForm from '../../components/search-form/SearchForm';
import PlainButton from '../../components/plain-button';
import LoadingIndicator from '../../components/loading-indicator';
import { Flyout, Overlay } from '../../components/flyout';
import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import messages from './messages';
import { TEMPLATE_CUSTOM_PROPERTIES } from './constants';
import './TemplateDropdown.scss';
const getAvailableTemplates = (allTemplates, usedTemplates) => allTemplates.filter(template => usedTemplates.findIndex(usedTemplate => usedTemplate.templateKey === template.templateKey && usedTemplate.scope === template.scope) === -1);
class TemplateDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "getDropdown", () => {
      const {
        isDropdownBusy,
        onAdd,
        activeTemplate,
        defaultTemplateIcon,
        activeTemplateIcon,
        templates: allTemplates,
        title,
        usedTemplates
      } = this.props;
      const {
        templates
      } = this.state;
      const hasUnusedTemplates = getAvailableTemplates(allTemplates, usedTemplates).length > 0;
      const hasTemplates = allTemplates.length > 0;
      const hasResults = templates.length > 0;
      let indicatorOrMessage = null;
      if (isDropdownBusy) {
        indicatorOrMessage = /*#__PURE__*/React.createElement(LoadingIndicator, {
          className: "metadata-instance-editor-template-message template-dropdown-loading-indicator"
        });
      } else if (!hasTemplates || !hasUnusedTemplates || !hasResults) {
        let message = {
          id: ''
        };
        if (!hasTemplates) {
          message = messages.metadataTemplatesServerHasNoTemplates;
        } else if (!hasUnusedTemplates) {
          message = messages.metadataTemplatesNoRemainingTemplates;
        } else if (!hasResults) {
          message = messages.metadataTemplatesNoResults;
        }
        indicatorOrMessage = /*#__PURE__*/React.createElement("i", {
          className: "metadata-instance-editor-template-message"
        }, /*#__PURE__*/React.createElement(FormattedMessage, message));
      }
      const renderedTemplates = templates.map(template => {
        const isTemplateSelected = activeTemplate && activeTemplate.id === template.id;
        const buttonClassName = classNames('metadata-template-dropdown-select-template', {
          'metadata-template-dropdown-is-selected': isTemplateSelected
        });
        return /*#__PURE__*/React.createElement(DatalistItem, {
          key: template.id
        }, /*#__PURE__*/React.createElement(PlainButton, {
          className: buttonClassName,
          tabIndex: "-1",
          type: "button"
        }, isTemplateSelected ? activeTemplateIcon : defaultTemplateIcon, this.getTemplateName(template)));
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SelectorDropdown, {
        className: "metadata-instance-editor-template-dropdown-menu",
        title: title,
        isAlwaysOpen: true,
        onSelect: index => {
          onAdd(templates[index]);
        },
        selector: this.getSelector(),
        shouldScroll: true
      }, indicatorOrMessage ? null : renderedTemplates), indicatorOrMessage);
    });
    /**
     * Returns the input field for the drop down
     *
     * @return {React.Node} - input selector
     */
    _defineProperty(this, "getSelector", () => {
      const {
        intl
      } = this.props;
      const {
        filterText
      } = this.state;
      return /*#__PURE__*/React.createElement(SearchForm, {
        "data-resin-target": "metadata-templatesearch",
        label: "",
        onChange: this.handleUserInput,
        placeholder: intl.formatMessage(messages.metadataTemplateSearchPlaceholder),
        shouldPreventClearEventPropagation: true,
        type: "text",
        useClearButton: true,
        value: filterText
      });
    });
    /**
     * Updates the filter text and filters the results
     *
     * @param {UserInput} userInput - input value returned from onChangeHandler from SearchForm.js
     * @return {void}
     */
    _defineProperty(this, "handleUserInput", userInput => {
      const {
        templates: allTemplates,
        usedTemplates
      } = this.props;
      const filterText = userInput;
      const templates = getAvailableTemplates(allTemplates, usedTemplates);
      this.setState({
        filterText,
        templates: templates.filter(template => {
          const label = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES ? messages.customTitle.defaultMessage : template.displayName;
          return label.toLowerCase().includes(filterText.toLowerCase());
        })
      });
    });
    _defineProperty(this, "onOpen", () => {
      const {
        onDropdownToggle,
        templates,
        usedTemplates
      } = this.props;
      if (onDropdownToggle) {
        onDropdownToggle(true);
      }
      this.setState({
        isDropdownOpen: true,
        filterText: '',
        templates: getAvailableTemplates(templates, usedTemplates)
      });
    });
    _defineProperty(this, "onClose", () => {
      const {
        onDropdownToggle
      } = this.props;
      if (onDropdownToggle) {
        onDropdownToggle(false);
      }
      this.setState({
        isDropdownOpen: false
      });
    });
    _defineProperty(this, "renderEntryButton", () => {
      const {
        entryButton
      } = this.props;
      const {
        isDropdownOpen
      } = this.state;
      const buttonToggleClassName = classNames('lnk', {
        'is-toggled': isDropdownOpen
      });
      if (entryButton) {
        return entryButton;
      }
      return /*#__PURE__*/React.createElement(PlainButton, {
        "data-resin-target": "metadata-templateaddmenu",
        className: buttonToggleClassName,
        type: "button"
      }, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataTemplateAdd)));
    });
    this.state = {
      isDropdownOpen: false,
      filterText: '',
      templates: getAvailableTemplates(props.templates, props.usedTemplates)
    };
  }

  /**
   * Updates the state
   *
   * @param {Object} prevProps - next props
   * @return {void}
   */
  componentDidUpdate({
    templates: prevTemplates,
    usedTemplates: prevUsedTemplates
  }) {
    const {
      templates,
      usedTemplates
    } = this.props;
    if (!isEqual(prevTemplates, templates) || !isEqual(prevUsedTemplates, usedTemplates)) {
      this.setState({
        templates: getAvailableTemplates(templates, usedTemplates)
      });
    }
  }
  /**
   * Returns template display name.
   * For custom metadata we have it on the client.
   *
   * @return {React.Node} - string or formatted name
   */
  getTemplateName(template) {
    return template.templateKey === TEMPLATE_CUSTOM_PROPERTIES ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      className: "template-display-name"
    }, messages.customTitle)) : /*#__PURE__*/React.createElement("div", {
      className: "template-display-name"
    }, template.displayName);
  }
  render() {
    const {
      className
    } = this.props;
    const flyoutClassName = classNames('metadata-instance-editor-template-dropdown-flyout', className);
    return /*#__PURE__*/React.createElement(Flyout, {
      className: flyoutClassName,
      closeOnClick: true,
      closeOnClickOutside: true,
      constrainToWindowWithPin: true,
      onClose: this.onClose,
      onOpen: this.onOpen,
      position: "bottom-left",
      shouldDefaultFocus: true
    }, this.renderEntryButton(), /*#__PURE__*/React.createElement(Overlay, null, this.getDropdown()));
  }
}
export { TemplateDropdown as TemplateDropdownBase };
export default injectIntl(TemplateDropdown);
//# sourceMappingURL=TemplateDropdown.js.map