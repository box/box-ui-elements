function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import Measure from 'react-measure';
import forEach from 'lodash/forEach';
import CategorySelectorComponent from './CategorySelectorComponent';
import './CategorySelector.scss';
const CategorySelector = ({
  categories,
  categoryProps = {},
  className = '',
  currentCategory = '',
  onSelect
}) => {
  const linksRef = React.useRef(null);
  const moreRef = React.useRef(null);
  const [maxLinks, setMaxLinks] = React.useState(categories.length);
  const defaultLinkWidths = {};
  const [linkWidths, setLinkWidths] = React.useState(defaultLinkWidths);
  const [moreWidth, setMoreWidth] = React.useState(0);
  const outerWidth = element => {
    const style = getComputedStyle(element);
    return element.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight) + 1;
  };
  const checkLinks = React.useCallback(contentRect => {
    const {
      width
    } = contentRect.client;
    if (!linksRef.current) return;

    // Pull in some common widths we'll need
    const containerWidth = width - moreWidth;

    // Get all the links
    const elements = linksRef.current.querySelectorAll('[data-category]');

    // First, calculate the total width of all links in the main section
    let linksWidth = 0;
    forEach(elements, element => {
      linksWidth += outerWidth(element);
    });
    if (linksWidth > containerWidth) {
      // The links exceed the container's width. Figure out how many need to be removed
      const linksToRemove = {};
      let counter = 1;
      while (linksWidth > containerWidth && counter < elements.length) {
        const element = elements[elements.length - counter];
        const elementWidth = outerWidth(element);
        linksWidth -= elementWidth;
        const category = element.dataset.category ?? '';
        // Save the width of the link being removed for use later
        linksToRemove[category] = elementWidth;
        counter += 1;
      }

      // Ensure the maxLinks does not become negative
      const max = maxLinks - Object.keys(linksToRemove).length < 0 ? 0 : maxLinks - Object.keys(linksToRemove).length;

      // Update the state
      setMaxLinks(max);
      setLinkWidths(_objectSpread(_objectSpread({}, linkWidths), linksToRemove));
    } else {
      // There is more room, see if any links can be brought back in
      let linksToAdd = 0;
      while (maxLinks + linksToAdd < categories.length && linksWidth < containerWidth) {
        const category = categories[maxLinks + linksToAdd].value;
        const elementWidth = linkWidths[category];

        // If there is only one link in the More menu, calculate against the total container width,
        // otherwise calculate against the container less the width of the more button
        const targetWidth = maxLinks + linksToAdd + 1 >= categories.length ? width : containerWidth;

        // If the addition of a link is too large, stop checking
        if (linksWidth + elementWidth >= targetWidth) {
          break;
        }
        linksToAdd += 1;
        linksWidth += elementWidth; // always add
      }
      if (linksToAdd > 0) {
        // Update the state
        setMaxLinks(maxLinks + linksToAdd);
      }
    }
  }, [categories, linkWidths, linksRef, maxLinks, moreWidth]);
  React.useLayoutEffect(() => {
    if (!moreRef.current) return;
    setMoreWidth(outerWidth(moreRef.current));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreRef.current, currentCategory]);

  // This effect must be defined after the checkLinks function
  // If the currently selected category changes or the more link width changes, be sure to check for any links to hide or show
  React.useEffect(() => {
    if (!linksRef.current) return;
    const {
      clientWidth
    } = linksRef.current;
    checkLinks({
      client: {
        width: clientWidth
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreRef.current, moreWidth, currentCategory]);
  return /*#__PURE__*/React.createElement(Measure, {
    client: true,
    innerRef: linksRef,
    onResize: checkLinks
  }, ({
    measureRef
  }) => /*#__PURE__*/React.createElement(CategorySelectorComponent, {
    measureRef: measureRef,
    moreRef: moreRef,
    className: className,
    categories: categories,
    maxLinks: maxLinks,
    currentCategory: currentCategory,
    onSelect: onSelect,
    categoryProps: categoryProps
  }));
};
export default CategorySelector;
//# sourceMappingURL=CategorySelector.js.map