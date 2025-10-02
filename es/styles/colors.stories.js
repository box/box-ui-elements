function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import Color from 'color';
import * as variables from './variables';
import mdNotes from './colors.md';
const bdlColors = {};
const WCAG_AA = 4.5; // minimum contrast ratio for text

const isPaletteColor = (hex, key) => {
  return key.startsWith('bdl') && !key.includes('Neutral') && key !== 'bdlSecondaryBlue' && hex.startsWith('#');
};
Object.keys(variables).forEach(colorKey => {
  const colorHex = variables[colorKey];
  if (Array.isArray(colorHex)) return;
  if (isPaletteColor(colorHex, colorKey)) {
    const paletteGroup = colorKey.match(/[A-Z][a-z]+/g).join(' ');
    if (!bdlColors[paletteGroup]) {
      bdlColors[paletteGroup] = [];
    }
    const color = Color(colorHex);
    const scssVariableName = colorKey.match(/(bdl)|([A-Z][a-z]+)|(\d+)/g).join('-');
    const contrastRatio = color.contrast(Color('#fff'));
    bdlColors[paletteGroup].push({
      scssVariableName,
      colorHex,
      colorKey,
      contrastRatio
    });
  }
});
const wrapper = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
};
const palette = {};
const swatchContainer = {
  display: 'flex',
  alignItems: 'center'
};
const swatch = {
  borderRadius: '4px',
  height: '40px',
  width: '200px',
  display: 'inline-block'
};
const label = {
  margin: '0 8px 0 16px'
};
const LabelCell = props => /*#__PURE__*/React.createElement("td", {
  style: {
    minWidth: 240
  }
}, props.children);
const Swatch = ({
  color
}) => /*#__PURE__*/React.createElement("div", {
  style: swatchContainer
}, /*#__PURE__*/React.createElement("span", {
  style: _objectSpread(_objectSpread({}, swatch), {}, {
    backgroundColor: color.colorHex
  })
}), /*#__PURE__*/React.createElement("table", {
  style: label
}, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(LabelCell, null, /*#__PURE__*/React.createElement("strong", null, "SCSS:"), " ", /*#__PURE__*/React.createElement("code", null, "$", color.scssVariableName.toLowerCase())), /*#__PURE__*/React.createElement(LabelCell, null, /*#__PURE__*/React.createElement("strong", {
  title: "WCAG contrast ratio against white background"
}, "WCAG:"), ' ', /*#__PURE__*/React.createElement("code", null, color.contrastRatio.toFixed(2)), ' ', color.contrastRatio > WCAG_AA ? '(AA ✔︎)' : /*#__PURE__*/React.createElement("s", null, "(AA)"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(LabelCell, null, /*#__PURE__*/React.createElement("strong", null, "JS:"), " ", /*#__PURE__*/React.createElement("code", null, color.colorKey)), /*#__PURE__*/React.createElement(LabelCell, null, /*#__PURE__*/React.createElement("strong", null, "Hex:"), " ", /*#__PURE__*/React.createElement("code", null, color.colorHex)))));
const allColors = () => /*#__PURE__*/React.createElement("div", {
  style: wrapper
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Base"), /*#__PURE__*/React.createElement("div", {
  style: palette
}, /*#__PURE__*/React.createElement(Swatch, {
  key: "black",
  color: {
    scssVariableName: 'black',
    colorHex: '#000000',
    colorKey: 'black',
    contrastRatio: 100
  }
}), /*#__PURE__*/React.createElement(Swatch, {
  key: "white",
  color: {
    scssVariableName: 'white',
    colorHex: '#ffffff',
    colorKey: 'white',
    contrastRatio: 0
  }
}))), Object.entries(bdlColors).sort((A, B) => {
  // Sort the palette by grayness (hue/saturation = 0) and then by color
  const a = Color(A[1][0].colorHex);
  const b = Color(B[1][0].colorHex);
  if (a.hsl().object().h === 0) return -1;
  if (b.hsl().object().h === 0) return 1;
  return a.rgbNumber() - b.rgbNumber();
}).map(([name, colors]) => /*#__PURE__*/React.createElement("div", {
  key: name
}, /*#__PURE__*/React.createElement("h4", null, name), /*#__PURE__*/React.createElement("div", {
  style: palette
}, colors.map(color => /*#__PURE__*/React.createElement(Swatch, {
  key: color.colorKey,
  color: color
}))))));
export { allColors };
export default {
  title: 'Theming/Colors',
  parameters: {
    notes: mdNotes
  }
};
//# sourceMappingURL=colors.stories.js.map