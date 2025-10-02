import * as React from 'react';
import { useIntl } from 'react-intl';
import { SearchInput } from '@box/blueprint-web';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';
import './Header.scss';
const Header = ({
  isHeaderLogoVisible = true,
  logoUrl,
  onSearch,
  view
}) => {
  const {
    formatMessage
  } = useIntl();
  const searchMessage = formatMessage(messages.searchPlaceholder);
  const isFolder = view === VIEW_FOLDER;
  const isSearch = view === VIEW_SEARCH;
  return /*#__PURE__*/React.createElement("div", {
    className: "be-header"
  }, isHeaderLogoVisible && /*#__PURE__*/React.createElement(Logo, {
    url: logoUrl
  }), /*#__PURE__*/React.createElement("div", {
    className: "be-search"
  }, /*#__PURE__*/React.createElement(SearchInput, {
    disabled: !isFolder && !isSearch,
    onChange: onSearch,
    placeholder: searchMessage,
    searchInputAriaLabel: searchMessage,
    searchInputClearAriaLabel: formatMessage(messages.searchClear),
    variant: "global"
  })));
};
export default Header;
//# sourceMappingURL=Header.js.map