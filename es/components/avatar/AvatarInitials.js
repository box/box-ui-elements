import * as React from 'react';
import { avatarColors } from '../../styles/variables';
const getInitials = name => {
  // Remove any bracketed text from the user name
  const cleanedName = name.replace(/[[({<]+.*[\])}>]+/g, '').trim();
  const firstInitial = cleanedName.slice(0, 1);
  const lastInitial = cleanedName.slice(cleanedName.lastIndexOf(' ') + 1, cleanedName.lastIndexOf(' ') + 2);
  return (firstInitial + lastInitial).toUpperCase();
};
const AvatarInitials = ({
  className = '',
  id = 0,
  name
}) => {
  const avatarColorSelector = parseInt(id, 10) || 0;
  const backgroundColorIndex = avatarColorSelector % avatarColors.length;
  return /*#__PURE__*/React.createElement("span", {
    className: `avatar-initials ${className}`,
    "data-bg-idx": backgroundColorIndex
  }, getInitials(name));
};
export default AvatarInitials;
//# sourceMappingURL=AvatarInitials.js.map