import classNames from 'classnames';
import * as React from 'react';
import CarouselHeader from './CarouselHeader';
import SlideNavigator from './SlideNavigator';
import SlidePanels from './SlidePanels';
const SlideCarouselPrimitive = ({
  children,
  className,
  contentHeight,
  idPrefix = '',
  onSelection,
  selectedIndex,
  title
}) => {
  const buttonIdGenerator = val => `${idPrefix && `${idPrefix}-`}selector-${val}`;
  const panelIdGenerator = val => `${idPrefix && `${idPrefix}-`}slide-panel-${val}`;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('slide-carousel', className)
  }, title && /*#__PURE__*/React.createElement(CarouselHeader, {
    title: title
  }), /*#__PURE__*/React.createElement(SlidePanels, {
    getButtonIdFromValue: buttonIdGenerator,
    getPanelIdFromValue: panelIdGenerator,
    onSelection: onSelection,
    selectedIndex: selectedIndex,
    style: {
      height: contentHeight
    }
  }, children), /*#__PURE__*/React.createElement(SlideNavigator, {
    getButtonIdFromValue: buttonIdGenerator,
    getPanelIdFromValue: panelIdGenerator
    // $FlowFixMe
    ,
    numOptions: children && children.length || 0,
    onSelection: onSelection,
    selectedIndex: selectedIndex
  }));
};
SlideCarouselPrimitive.displayName = 'SlideCarouselPrimitive';
SlideCarouselPrimitive.defaultProps = {
  className: '',
  idPrefix: '',
  onSelection: () => {}
};
export default SlideCarouselPrimitive;
//# sourceMappingURL=SlideCarouselPrimitive.js.map