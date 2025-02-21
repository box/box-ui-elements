"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@testing-library/react");
// Data Providers
var blueprint_web_1 = require("@box/blueprint-web");
var react_intl_1 = require("react-intl");
var feature_checking_1 = require("../elements/common/feature-checking");
jest.unmock('react-intl');
var Wrapper = function (_a) {
    var children = _a.children, _b = _a.features, features = _b === void 0 ? {} : _b;
    return (react_1.default.createElement(feature_checking_1.FeatureProvider, { features: features },
        react_1.default.createElement(blueprint_web_1.TooltipProvider, null,
            react_1.default.createElement(react_intl_1.IntlProvider, { locale: "en" }, children))));
};
var renderConnected = function (element, options) {
    if (options === void 0) { options = {}; }
    return (0, react_2.render)(element, __assign({ wrapper: options.wrapper ? options.wrapper : function (props) { return react_1.default.createElement(Wrapper, __assign({}, props, options.wrapperProps)); } }, options));
};
exports.render = renderConnected;
__exportStar(require("@testing-library/react"), exports);
