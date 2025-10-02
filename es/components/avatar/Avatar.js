import * as React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Badgeable from '../badgeable';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from './UnknownUserAvatar';
import GlobeBadge16 from '../../icon/fill/GlobeBadge16';
import messages from './messages';
import './Avatar.scss';
const SIZES = {
  small: true,
  large: true
};
function Avatar({
  avatarUrl,
  badgeIcon,
  className,
  name,
  id,
  intl,
  isExternal,
  shouldShowExternal = false,
  size = ''
}) {
  const {
    formatMessage
  } = intl;
  const [hasImageErrored, setHasImageErrored] = React.useState(false);
  const [prevAvatarUrl, setPrevAvatarUrl] = React.useState(null);
  const classes = classNames(['avatar', className, {
    [`avatar--${size}`]: size && SIZES[size],
    'avatar--isExternal': shouldShowExternal && isExternal,
    'avatar--iconBadge': !!badgeIcon
  }]);

  // Reset hasImageErrored state when avatarUrl changes
  if (avatarUrl !== prevAvatarUrl) {
    setHasImageErrored(false);
    setPrevAvatarUrl(avatarUrl);
  }
  let avatar;
  if (avatarUrl && !hasImageErrored) {
    avatar = /*#__PURE__*/React.createElement(AvatarImage, {
      onError: () => {
        setHasImageErrored(true);
      },
      url: avatarUrl
    });
  } else if (name) {
    avatar = /*#__PURE__*/React.createElement(AvatarInitials, {
      id: id,
      name: name
    });
  } else {
    avatar = /*#__PURE__*/React.createElement(UnknownUserAvatar, {
      className: "avatar-icon"
    });
  }
  let badge = null;
  if (shouldShowExternal && isExternal) {
    badge = /*#__PURE__*/React.createElement(GlobeBadge16, {
      className: "bdl-Avatar-externalBadge",
      title: formatMessage(messages.externalUser)
    });
  } else if (badgeIcon) {
    badge = /*#__PURE__*/React.createElement("div", {
      className: "bdl-Avatar-badge bdl-Avatar-iconBadge"
    }, badgeIcon);
  }
  return /*#__PURE__*/React.createElement(Badgeable, {
    className: classes,
    bottomRight: badge
  }, /*#__PURE__*/React.createElement("span", null, avatar));
}
export { Avatar as AvatarBase };
export default injectIntl(Avatar);
//# sourceMappingURL=Avatar.js.map