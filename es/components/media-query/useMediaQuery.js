function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { toQuery, useMediaQuery as _useMediaQuery } from 'react-responsive';
import { ANY_HOVER, ANY_POINTER_COARSE, ANY_POINTER_FINE, HOVER, HOVER_TYPE, POINTER_COARSE, POINTER_FINE, POINTER_TYPE, SIZE_LARGE, SIZE_MEDIUM, SIZE_SMALL, VIEW_SIZE_TYPE } from './constants';
const getPointerCapabilities = (isFine, isCoarse) => {
  if (!isFine && !isCoarse) return POINTER_TYPE.none;
  if (isFine) return POINTER_TYPE.fine;
  return POINTER_TYPE.coarse;
};
const getViewDimensions = () => {
  return {
    viewWidth: window.innerWidth,
    viewHeight: window.innerHeight
  };
};

/**
 * Formats the media query either as a MediaQuery object or string
 * @param query
 * @returns {string}
 */
function formatQuery(query) {
  return typeof query === 'string' ? query : toQuery(query);
}

/**
 * Executes media query
 * @param query
 * @param onQueryChange
 * @returns {boolean}
 */
function useQuery(query, onQueryChange) {
  return _useMediaQuery({
    query: formatQuery(query)
  }, null, onQueryChange);
}

/**
 * Determines device capabilities for hover and pointer features
 * @returns {{anyPointer: *, hover: (string), pointer: *, anyHover: (string)}}
 */
function useDeviceCapabilities() {
  const isHover = useQuery(HOVER);
  const isAnyHover = useQuery(ANY_HOVER);
  const anyHover = isAnyHover ? HOVER_TYPE.hover : HOVER_TYPE.none;
  const hover = isHover ? HOVER_TYPE.hover : HOVER_TYPE.none;
  const pointer = getPointerCapabilities(useQuery(POINTER_FINE), useQuery(POINTER_COARSE));
  const anyPointer = getPointerCapabilities(useQuery(ANY_POINTER_FINE), useQuery(ANY_POINTER_COARSE));
  const isTouchDevice = hover === HOVER_TYPE.none && pointer === POINTER_TYPE.coarse;
  return {
    anyHover,
    hover,
    anyPointer,
    pointer,
    isTouchDevice
  };
}

/**
 * Determines device size using media queries
 * @returns {string}
 */
function useDeviceSize() {
  const isSmall = useQuery(SIZE_SMALL);
  const isMedium = useQuery(SIZE_MEDIUM);
  const isLarge = useQuery(SIZE_LARGE);
  if (isSmall) return VIEW_SIZE_TYPE.small;
  if (isMedium) return VIEW_SIZE_TYPE.medium;
  if (isLarge) return VIEW_SIZE_TYPE.large;
  return VIEW_SIZE_TYPE.xlarge;
}
function useMediaQuery() {
  const deviceCapabilities = useDeviceCapabilities();
  const deviceSize = useDeviceSize();
  const viewDimensions = getViewDimensions();
  return _objectSpread(_objectSpread(_objectSpread({}, deviceCapabilities), viewDimensions), {}, {
    size: deviceSize
  });
}
export default useMediaQuery;
//# sourceMappingURL=useMediaQuery.js.map