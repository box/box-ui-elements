import * as React from 'react';
import IconExcelDesktop from './IconExcelDesktop';
import IconPowerPointDesktop from './IconPowerPointDesktop';
import IconWordDesktop from './IconWordDesktop';
const OfficeDesktopIcon = ({
  className,
  dimension = 30,
  extension,
  title
}) => {
  let Component = null;
  switch (extension) {
    case 'doc':
    case 'docx':
      Component = IconWordDesktop;
      break;
    case 'ppt':
    case 'pptx':
      Component = IconPowerPointDesktop;
      break;
    case 'xls':
    case 'xlsx':
    case 'xlsm':
    case 'xlsb':
      Component = IconExcelDesktop;
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
export default OfficeDesktopIcon;
//# sourceMappingURL=OfficeDesktopIcon.js.map