import * as React from 'react';
import KeynoteForMac32 from '../../icon/logo/KeynoteForMac32';
import NumbersForMac32 from '../../icon/logo/NumbersForMac32';
import PagesForMac32 from '../../icon/logo/PagesForMac32';
const IWorkIcon = ({
  className,
  dimension = 32,
  extension,
  title
}) => {
  let Component = null;
  switch (extension) {
    case 'pages':
      Component = PagesForMac32;
      break;
    case 'numbers':
      Component = NumbersForMac32;
      break;
    case 'key':
      Component = KeynoteForMac32;
      break;
    // no default
  }
  if (Component !== null) {
    return /*#__PURE__*/React.createElement(Component, {
      className: className,
      height: dimension,
      title: title,
      width: dimension
    });
  }
  return null;
};
export default IWorkIcon;
//# sourceMappingURL=IWorkIcon.js.map