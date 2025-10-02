import * as React from 'react';
import IconExcelOnline from './IconExcelOnline';
import IconPowerPointOnline from './IconPowerPointOnline';
import IconWordOnline from './IconWordOnline';
const OfficeOnlineIcon = ({
  className,
  dimension = 30,
  extension,
  title
}) => {
  let Component = null;
  switch (extension) {
    case 'doc':
    case 'docx':
      Component = IconWordOnline;
      break;
    case 'ppt':
    case 'pptx':
      Component = IconPowerPointOnline;
      break;
    case 'xls':
    case 'xlsx':
    case 'xlsm':
    case 'xlsb':
      Component = IconExcelOnline;
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
export default OfficeOnlineIcon;
//# sourceMappingURL=OfficeOnlineIcon.js.map