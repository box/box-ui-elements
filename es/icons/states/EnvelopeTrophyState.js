function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'envelope-trophy-state';
class EnvelopeTrophyState extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "idPrefix", `${uniqueId(ICON_CLASS)}-`);
  }
  render() {
    const {
      className,
      height,
      title,
      width
    } = this.props;
    return /*#__PURE__*/React.createElement(AccessibleSVG, {
      className: `${ICON_CLASS} ${className}`,
      height: height,
      title: title,
      viewBox: "0 0 448 418",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
      d: "M1.741 127.008L150.758 3.245a14.466 14.466 0 0 1 18.484 0L318.26 127.008a4.822 4.822 0 0 1 1.741 3.71v184.46a4.822 4.822 0 0 1-4.822 4.822H4.822A4.822 4.822 0 0 1 0 315.178v-184.46c0-1.435.638-2.794 1.741-3.71z",
      id: "a"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M168.86 212.968L307 320H13l138.14-107.032a14.466 14.466 0 0 1 17.72 0z",
      id: "c"
    }), /*#__PURE__*/React.createElement("filter", {
      filterUnits: "objectBoundingBox",
      height: "181.8%",
      id: "b",
      width: "130.6%",
      x: "-15.3%",
      y: "-49.1%"
    }, /*#__PURE__*/React.createElement("feOffset", {
      dy: "-9",
      in: "SourceAlpha",
      result: "shadowOffsetOuter1"
    }), /*#__PURE__*/React.createElement("feGaussianBlur", {
      in: "shadowOffsetOuter1",
      result: "shadowBlurOuter1",
      stdDeviation: "13.5"
    }), /*#__PURE__*/React.createElement("feColorMatrix", {
      in: "shadowBlurOuter1",
      values: "0 0 0 0 0.0823529412 0 0 0 0 0.121568627 0 0 0 0 0.149019608 0 0 0 0.06 0"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M76 71c30.376 0 55-24.624 55-55H21c0 30.376 24.624 55 55 55z",
      id: "e"
    }), /*#__PURE__*/React.createElement("filter", {
      filterUnits: "objectBoundingBox",
      height: "118.2%",
      id: "d",
      width: "109.1%",
      x: "-4.5%",
      y: "-7.3%"
    }, /*#__PURE__*/React.createElement("feOffset", {
      dy: "1",
      in: "SourceAlpha",
      result: "shadowOffsetOuter1"
    }), /*#__PURE__*/React.createElement("feGaussianBlur", {
      in: "shadowOffsetOuter1",
      result: "shadowBlurOuter1",
      stdDeviation: "1.5"
    }), /*#__PURE__*/React.createElement("feColorMatrix", {
      in: "shadowBlurOuter1",
      values: "0 0 0 0 0.960784314 0 0 0 0 0.725490196 0 0 0 0 0.352941176 0 0 0 0.32 0"
    }))), /*#__PURE__*/React.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React.createElement("g", {
      fillRule: "evenodd",
      transform: "translate(65 52)"
    }, /*#__PURE__*/React.createElement("use", {
      fill: "#5FC9CF",
      xlinkHref: "#a"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#000",
      fillOpacity: ".12",
      xlinkHref: "#a"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M78 235.016h293.951v68.78H78z",
      fill: "#90A0B0",
      fillRule: "nonzero",
      opacity: ".5",
      style: {
        mixBlendMode: 'multiply'
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: "M309 121.557V315H101V121.557c.003-3.871 1.473-7.581 4.084-10.312 2.611-2.731 6.15-4.259 9.835-4.245H295.13c7.655 0 13.863 6.515 13.87 14.557",
      fill: "#8EA6B2",
      fillRule: "nonzero",
      opacity: ".4",
      style: {
        mixBlendMode: 'multiply'
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: "M348.963 134.886V327H141V134.886c0-8.768 6.201-15.878 13.855-15.886h180.278c3.677 0 7.205 1.674 9.805 4.653 2.601 2.979 4.062 7.02 4.062 11.233",
      fill: "#8EA6B2",
      fillRule: "nonzero",
      opacity: ".2",
      style: {
        mixBlendMode: 'multiply'
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: "M329 303H121V108.77c.007-7.607 6.215-13.77 13.87-13.77h180.26c7.66 0 13.87 6.17 13.87 13.782V303z",
      fill: "#E9EEF3",
      fillRule: "nonzero"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M121 117h208v208H121z",
      fill: "#002947",
      fillRule: "nonzero"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M317 304V171.68c0-.972-.389-1.906-1.08-2.597l-37.356-37.012a3.74 3.74 0 0 0-2.62-1.071h-139.22c-2.057 0-3.724 1.653-3.724 3.693V304",
      fill: "#F9F9F9",
      fillRule: "nonzero"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M147 179h160v11.146H147V179zm0 21.61h160v11.145H147V200.61zm0 21.622h160v11.146H147v-11.146zm0 21.622h160V255H147v-11.146z",
      fill: "#E9EEF3",
      fillRule: "nonzero"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M254.94 161.64c.503-1.002-2.257-1.694-3.539-1.854a20.576 20.576 0 0 0-5.048.15c-4.788.601-9.933 1.703-14.867 1.423-.57-.006-1.094-.196-1.38-.501-1.087-1.333-4.674-.2-6.005.671.899-.594 1.556-1.312 1.916-2.094.86-1.863-6.395.882-7.077 1.092 2.954-.881 8.326-2.214 7.904-4.658-.779-4.508-18.438 3.176-20.548 4.238 2.666-.102 5.252-.604 7.531-1.463 2.695-1.002 4.87-2.274 7.499-3.326 3.83-1.573 7.856-2.725 10.923-4.89.795-.56 1.526-1.392.763-2.003-.763-.61-1.802-.41-2.792-.32-8.68.893-16.895 3.042-23.972 6.271-4.35 1.944-9.739 4.358-11.248 7.624",
      stroke: "#002947",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M65 188l158.81 90.174c.738.42 1.642.42 2.38 0L385 188v179.178a4.822 4.822 0 0 1-4.822 4.822H69.822A4.822 4.822 0 0 1 65 367.178V188z",
      fill: "#5FC9CF",
      fillRule: "nonzero"
    }), /*#__PURE__*/React.createElement("g", {
      fillRule: "nonzero",
      transform: "translate(65 52)"
    }, /*#__PURE__*/React.createElement("use", {
      fill: "#000",
      filter: "url(#b)",
      xlinkHref: "#c"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#5FC9CF",
      fillRule: "evenodd",
      xlinkHref: "#c"
    })), /*#__PURE__*/React.createElement("g", {
      transform: "translate(296 247)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M146.416 15.234H69.584C72.139 34.169 88.364 48.766 108 48.766c19.635 0 35.86-14.597 38.416-33.532z",
      stroke: "#F8D371",
      strokeWidth: "10.467"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M82.416 15.234H5.584C8.139 34.169 24.364 48.766 44 48.766c19.635 0 35.86-14.597 38.416-33.532z",
      stroke: "#F8D371",
      strokeWidth: "10.467"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M23.617 0h104.766A2.617 2.617 0 0 1 131 2.617V16H21V2.617A2.617 2.617 0 0 1 23.617 0z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#F5B95A",
      height: "16",
      rx: "2.617",
      width: "52",
      x: "50",
      y: "85"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#0061D5",
      height: "42",
      rx: "2.617",
      width: "79",
      x: "37",
      y: "98"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M39.617 98h73.766a2.617 2.617 0 0 1 2.617 2.617V140H37v-39.383A2.617 2.617 0 0 1 39.617 98z",
      fill: "#0061D5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M45.617 98h60.766a2.617 2.617 0 0 1 2.617 2.617V140H43v-39.383A2.617 2.617 0 0 1 45.617 98z",
      fill: "#FFF",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M58.617 98h33.766A2.617 2.617 0 0 1 95 100.617V140H56v-39.383A2.617 2.617 0 0 1 58.617 98z",
      fill: "#0061D5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M64 59h24l-8 39h-8z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#000",
      filter: "url(#d)",
      xlinkHref: "#e"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#F8D371",
      xlinkHref: "#e"
    })), /*#__PURE__*/React.createElement("g", {
      transform: "translate(158 178)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M68.418 100.732L107.29 78.29a1.6 1.6 0 0 1 2.185.585l22.489 38.952a1.6 1.6 0 0 1-1.305 2.398l-23.54 1.196a1.6 1.6 0 0 0-1.263.729L93.05 141.939a1.6 1.6 0 0 1-2.73-.07l-22.488-38.951a1.6 1.6 0 0 1 .586-2.186z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M87.854 89.511L107.29 78.29a1.6 1.6 0 0 1 2.185.585l22.489 38.952a1.6 1.6 0 0 1-1.305 2.398l-23.38 1.188a1.6 1.6 0 0 1-1.467-.798L87.854 89.511z",
      fill: "#FFF",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M25.918 77.832l38.872 22.443a1.6 1.6 0 0 1 .585 2.186l-22.488 38.95a1.6 1.6 0 0 1-2.73.07l-12.806-19.789a1.6 1.6 0 0 0-1.262-.728l-23.54-1.197a1.6 1.6 0 0 1-1.305-2.398l22.488-38.951a1.6 1.6 0 0 1 2.186-.586z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M45.354 89.054l19.436 11.22a1.6 1.6 0 0 1 .585 2.187l-22.488 38.95a1.6 1.6 0 0 1-2.73.07l-12.719-19.654a1.6 1.6 0 0 1-.042-1.67l17.958-31.103z",
      fill: "#FFF",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M51.677 10.66L64.982.833c.716-.528 1.016-.665 1.372-.756.357-.09.71-.09 1.068-.002.356.089.657.224 1.375.75l13.376 9.786 16.596-.13c.89-.007 1.213.059 1.554.195.341.137.629.344.865.626.236.281.4.568.672 1.415l5.058 15.746 13.503 9.65c.724.517.946.76 1.143 1.07.196.312.306.649.332 1.015.025.367-.01.695-.288 1.54l-5.174 15.745 5.234 15.69c.281.844.319 1.171.295 1.538a2.153 2.153 0 0 1-.328 1.016c-.195.312-.416.556-1.138 1.076l-13.486 9.73-4.977 15.737c-.269.848-.43 1.135-.666 1.418a2.153 2.153 0 0 1-.862.63c-.341.137-.664.204-1.554.201l-16.63-.055-13.304 9.826c-.716.529-1.016.666-1.372.756-.357.09-.71.091-1.068.002-.356-.088-.657-.224-1.375-.75l-13.376-9.786-16.596.13c-.89.007-1.213-.059-1.554-.195a2.153 2.153 0 0 1-.865-.625c-.236-.282-.4-.568-.672-1.415L27.082 86.66l-13.503-9.65c-.724-.517-.946-.76-1.143-1.071a2.153 2.153 0 0 1-.332-1.015c-.025-.367.01-.694.288-1.54l5.174-15.744-5.234-15.69c-.281-.844-.319-1.172-.295-1.539.024-.367.133-.704.328-1.016.195-.311.416-.556 1.138-1.076l13.486-9.73 4.977-15.737c.269-.848.43-1.135.666-1.417.235-.283.521-.492.862-.63.341-.138.664-.205 1.554-.202l16.63.056z",
      fill: "#FC6279"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "67",
      cy: "58",
      fill: "#FFF",
      opacity: ".18",
      r: "36"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "67",
      cy: "58",
      fill: "#FFF",
      opacity: ".18",
      r: "30"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "67",
      cy: "58",
      fill: "#FC6279",
      r: "26"
    })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M389.144 104.443l-9.02-2.759a1.214 1.214 0 0 0-1.557 1.339c.292 1.973-.533 4.642-2.476 8.007-2.42 4.192-7.077 7.202-13.97 9.029a1.214 1.214 0 0 0-.296 2.224l13.059 7.54c.206.119.443.175.68.16 5.91-.363 10.155-2.78 12.737-7.253 2.552-4.42 3.111-10.208 1.679-17.364a1.214 1.214 0 0 0-.836-.923z",
      fill: "#50BEC3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M264.587 26.584l-9.192 2.121a1.214 1.214 0 0 0-.679 1.937c1.24 1.563 1.86 4.287 1.86 8.173 0 4.84-2.529 9.776-7.585 14.804a1.214 1.214 0 0 0 .856 2.075h15.08c.238 0 .47-.07.67-.202 4.935-3.269 7.403-7.485 7.403-12.65 0-5.103-2.41-10.395-7.229-15.877a1.214 1.214 0 0 0-1.184-.381z",
      fill: "#F85064"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M234.93 3.692L225.91.932a1.214 1.214 0 0 0-1.556 1.34c.292 1.972-.533 4.641-2.476 8.006-2.42 4.193-7.078 7.203-13.97 9.03a1.214 1.214 0 0 0-.296 2.224l13.058 7.54c.207.119.444.174.682.16 5.908-.363 10.154-2.78 12.736-7.253 2.552-4.42 3.111-10.208 1.678-17.365a1.214 1.214 0 0 0-.835-.922z",
      fill: "#8B37E4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.413 305.774l9.192 2.122a1.214 1.214 0 0 1 .679 1.937c-1.24 1.562-1.86 4.287-1.86 8.172 0 4.841 2.529 9.776 7.585 14.805a1.214 1.214 0 0 1-.856 2.074H8.073c-.238 0-.47-.07-.67-.201C2.469 331.413 0 327.197 0 322.033c0-5.103 2.41-10.396 7.229-15.877.295-.335.75-.482 1.184-.382z",
      fill: "#50BEC3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M44.93 270.902l-5.137-7.912a1.214 1.214 0 0 0-2.052.025c-1.044 1.699-3.392 3.213-7.044 4.542-4.549 1.656-10.05.968-16.505-2.063a1.214 1.214 0 0 0-1.657 1.514l5.157 14.169c.082.224.228.42.42.56 4.759 3.52 9.565 4.398 14.418 2.631 4.796-1.745 8.945-5.82 12.447-12.223.215-.391.197-.869-.046-1.243z",
      fill: "#8B37E4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M376.612 369.629l6.433-6.9a1.214 1.214 0 0 1 2.016.381c.734 1.855 2.783 3.753 6.149 5.696 4.192 2.42 9.73 2.699 16.613.834a1.214 1.214 0 0 1 1.368 1.779l-7.54 13.059c-.118.206-.296.373-.509.48-5.299 2.64-10.184 2.668-14.657.086-4.42-2.552-7.798-7.285-10.135-14.199a1.214 1.214 0 0 1 .262-1.216z",
      fill: "#F85064"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M445.603 331.999l-6.434-6.9a1.214 1.214 0 0 0-2.016.381c-.734 1.855-2.783 3.753-6.148 5.696-4.193 2.42-9.73 2.699-16.613.834a1.214 1.214 0 0 0-1.369 1.779l7.54 13.059c.119.206.296.373.51.48 5.298 2.64 10.184 2.668 14.656.086 4.42-2.552 7.798-7.285 10.136-14.199.143-.423.042-.89-.262-1.216z",
      fill: "#F0A226"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M49.509 123.424l8.405-4.284a1.214 1.214 0 0 1 1.765 1.048c.055 1.994 1.331 4.48 3.829 7.456 3.112 3.708 8.22 5.864 15.326 6.466a1.214 1.214 0 0 1 .677 2.14l-11.55 9.692c-.183.153-.407.249-.644.276-5.882.669-10.483-.975-13.802-4.931-3.28-3.91-4.837-9.513-4.668-16.81.01-.446.264-.85.662-1.053zM49.509 364.524l8.405-4.284a1.214 1.214 0 0 1 1.765 1.048c.055 1.994 1.331 4.48 3.829 7.456 3.112 3.708 8.22 5.864 15.326 6.466a1.214 1.214 0 0 1 .677 2.14l-11.55 9.692c-.183.153-.407.249-.644.276-5.882.669-10.483-.975-13.802-4.931-3.28-3.91-4.837-9.513-4.668-16.81.01-.446.264-.85.662-1.053z",
      fill: "#F85064"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M127.499 34.147c-4.839 2.607-9.855 10.094-6.882 15.427 2.973 5.332 10.944 8.783 13.839 7.1 4.226-2.458 4.214-6.568 2.026-8.403-2.187-1.835-5.306-1.911-7.195 1.18-1.89 3.091-.94 22.905 2.499 26.247 3.439 3.342 7.536 2.252 8.769-1.844 1.233-4.096-1.13-7.883-4.72-7.429-3.592.454-7.314 4.59-7.993 11.094-.453 4.336 4.658 9.595 15.331 15.778",
      stroke: "#F0A226",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "6.069"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M418.527 183.453c4.839 2.607 9.855 10.095 6.882 15.427-2.973 5.333-10.944 8.783-13.839 7.1-4.225-2.458-4.213-6.568-2.026-8.403 2.187-1.835 5.306-1.91 7.195 1.18 1.89 3.092.94 22.906-2.499 26.248-3.439 3.342-7.536 2.25-8.769-1.845-1.232-4.096 1.13-7.883 4.721-7.429 3.591.455 7.314 4.59 7.992 11.094.453 4.336-4.658 9.595-15.331 15.778",
      stroke: "#26C281",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "6.069"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M241.629 354.925c-4.839 2.607-9.855 10.095-6.882 15.427 2.973 5.333 10.944 8.784 13.839 7.1 4.225-2.458 4.213-6.567 2.026-8.402-2.187-1.836-5.306-1.911-7.195 1.18-1.89 3.091-.94 22.905 2.499 26.247 3.439 3.342 7.536 2.251 8.769-1.845 1.232-4.095-1.13-7.883-4.721-7.428-3.591.454-7.314 4.59-7.992 11.093-.453 4.336 4.658 9.595 15.33 15.778",
      stroke: "#8B37E4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "6.069"
    }))));
  }
}
_defineProperty(EnvelopeTrophyState, "defaultProps", {
  className: '',
  height: 418,
  width: 448
});
export default EnvelopeTrophyState;
//# sourceMappingURL=EnvelopeTrophyState.js.map