import * as React from 'react';
import Badge from './Badge';
import notes from './Badge.stories.md';
import { BadgeType } from './types';
export const regular = () => /*#__PURE__*/React.createElement(Badge, null, "Default Badge");
export const info = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.INFO
}, "Info Badge");
export const warning = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.WARNING
}, "Warning Badge");
export const highlight = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.HIGHLIGHT
}, "Highlight Badge");
export const error = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.ERROR
}, "Error Badge");
export const alert = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.ALERT
}, "Alert Badge");
export const success = () => /*#__PURE__*/React.createElement(Badge, {
  type: BadgeType.SUCCESS
}, "Success Badge");
export default {
  title: 'Components/Badges/Badge',
  component: Badge,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Badge.stories.js.map