import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TemplateDropdown from './TemplateDropdown';
import messages from './messages';
import { isHidden } from './metadataUtil';
import './Header.scss';
const Header = ({
  canAdd,
  editors,
  isDropdownBusy,
  onAdd,
  templates,
  title
}) => /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor-header"
}, title || /*#__PURE__*/React.createElement("h4", {
  className: "metadata-instance-editor-title"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataTemplatesTitle)), canAdd && onAdd && /*#__PURE__*/React.createElement(TemplateDropdown, {
  isDropdownBusy: isDropdownBusy,
  onAdd: onAdd,
  templates: templates.filter(template => !isHidden(template) // Checking both isHidden and hidden attributes due to differences in V2 and V3 APIs
  ),
  usedTemplates: editors.map(editor => editor.template)
}));
export default Header;
//# sourceMappingURL=Header.js.map