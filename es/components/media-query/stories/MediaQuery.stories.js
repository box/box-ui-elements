import * as React from 'react';
import { VIEW_SIZE_TYPE } from '../constants';
import notes from './MediaQuery.stories.md';
import useMediaQuery from '../useMediaQuery';
import withMediaQuery from '../withMediaQuery';
export const CustomHook = () => {
  const {
    hover,
    isTouchDevice,
    pointer,
    size,
    viewWidth,
    viewHeight
  } = useMediaQuery();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Hover:"), /*#__PURE__*/React.createElement("span", null, ` ${hover}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Pointer:"), /*#__PURE__*/React.createElement("span", null, ` ${pointer}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Is Touch Device:"), /*#__PURE__*/React.createElement("span", null, ` ${String(isTouchDevice)}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "View Dimensions:"), /*#__PURE__*/React.createElement("span", null, ` ${viewWidth}px (w) x ${viewHeight}px (h)`)), size === VIEW_SIZE_TYPE.small && /*#__PURE__*/React.createElement("h4", null, "This view is small"), size === VIEW_SIZE_TYPE.medium && /*#__PURE__*/React.createElement("h3", null, "This view is medium"), size === VIEW_SIZE_TYPE.large && /*#__PURE__*/React.createElement("h2", null, "This view is large"), size === VIEW_SIZE_TYPE.xlarge && /*#__PURE__*/React.createElement("h1", null, "This view is xlarge"));
};
const DemoComponent = props => {
  const {
    hover,
    isTouchDevice,
    pointer,
    size,
    viewWidth,
    viewHeight
  } = props;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Hover:"), /*#__PURE__*/React.createElement("span", null, ` ${hover}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Pointer:"), /*#__PURE__*/React.createElement("span", null, ` ${pointer}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Is Touch Device:"), /*#__PURE__*/React.createElement("span", null, ` ${String(isTouchDevice)}`)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "View Dimensions:"), /*#__PURE__*/React.createElement("span", null, ` ${viewWidth}px (w) x ${viewHeight}px (h)`)), size === 'small' && /*#__PURE__*/React.createElement("h4", null, "This view is small"), size === 'medium' && /*#__PURE__*/React.createElement("h3", null, "This view is medium"), size === 'large' && /*#__PURE__*/React.createElement("h2", null, "This view is large"), size === 'x-large' && /*#__PURE__*/React.createElement("h1", null, "This view is xlarge"));
};
export const HigherOrderComponent = withMediaQuery(DemoComponent);
export default {
  title: 'Components/MediaQuery',
  component: useMediaQuery,
  parameters: {
    notes,
    viewport: {
      defaultViewport: 'tablet'
    }
  }
};
//# sourceMappingURL=MediaQuery.stories.js.map