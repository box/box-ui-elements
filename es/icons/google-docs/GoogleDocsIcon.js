import * as React from 'react';
import IconGoogleSlides from './IconGoogleSlides';
import IconGoogleSheets from './IconGoogleSheets';
import IconGoogleDocs from './IconGoogleDocs';
const GoogleDocsIcon = ({
  className,
  dimension = 30,
  extension,
  title
}) => {
  let Component = null;
  switch (extension) {
    case 'docm':
    case 'docx':
    case 'gdoc':
    case 'odt':
      Component = IconGoogleDocs;
      break;
    case 'gsheet':
    case 'ods':
    case 'xlsm':
    case 'xlsx':
      Component = IconGoogleSheets;
      break;
    case 'gslide':
    case 'gslides':
    case 'odp':
    case 'pptm':
    case 'pptx':
      Component = IconGoogleSlides;
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
export default GoogleDocsIcon;
//# sourceMappingURL=GoogleDocsIcon.js.map