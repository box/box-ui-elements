import * as React from 'react';
const AvatarImage = ({
  className = '',
  url,
  onError
}) => /*#__PURE__*/React.createElement("img", {
  alt: "",
  className: `avatar-image ${className}`,
  onError: event => {
    if (typeof onError === 'function') {
      onError(event);
    }
  },
  src: url
});
export default AvatarImage;
//# sourceMappingURL=AvatarImage.js.map