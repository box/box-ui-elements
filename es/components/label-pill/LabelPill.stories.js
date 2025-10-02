import * as React from 'react';
import Shield16 from '../../icon/line/Shield16';
import LabelPill, { LabelPillStatus, LabelPillSize } from './LabelPill';
import notes from './LabelPill.stories.md';
export const withText = () => /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.DEFAULT,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "TEST TEXT"));
export const withIcon = () => /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.DEFAULT,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Icon, {
  Component: Shield16
}));
export const withBoth = () => /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.DEFAULT,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Icon, {
  Component: Shield16
}), /*#__PURE__*/React.createElement(LabelPill.Text, null, "TEST TEXT"));
export const severalComponents = () => /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'center'
  }
}, /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.WARNING,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "BETA")), ' ', /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.INFO,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "IN PROGRESS")), ' ', /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.WARNING,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Icon, {
  Component: Shield16
}), /*#__PURE__*/React.createElement(LabelPill.Text, null, "CONFIDENTIAL")), ' ', /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.FTUX,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "NEW")), ' ', /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.ALERT,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "DUE JUL 9 AT 11:59 PM")), ' ', /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: LabelPillStatus.SUCCESS,
  size: LabelPillSize.REGULAR
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, "SUCCESS")), ' ');
export default {
  title: 'Components/LabelPill',
  subcomponents: {
    'LabelPill.Pill': LabelPill.Pill,
    'LabelPill.Text': LabelPill.Text,
    'LabePill.Icon': LabelPill.Icon
  },
  parameters: {
    notes
  }
};
//# sourceMappingURL=LabelPill.stories.js.map