import * as React from 'react';
import ContactDatalistItem from './ContactDatalistItem';
export const Example = () => /*#__PURE__*/React.createElement(ContactDatalistItem, {
  getContactAvatarUrl: () => 'avatar.png',
  id: "123",
  isExternal: false,
  name: "Aaron Levie",
  showAvatar: true,
  subtitle: /*#__PURE__*/React.createElement("span", null, "CEO")
});
export default {
  title: 'Components/Dropdowns/ListItems/ContactDatalistItem',
  component: ContactDatalistItem,
  parameters: {
    notes: 'Used as a child of user/contact list components such as the PillSelectorDropdown'
  }
};
//# sourceMappingURL=ContactDatalistItem.stories.js.map