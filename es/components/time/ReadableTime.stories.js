import * as React from 'react';
import ReadableTime from './ReadableTime';
import notes from './ReadableTime.stories.md';
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * 7;
export const relativeTimestamps = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() - MILLISECONDS_PER_HOUR + 30 * 60 * 1000,
  relativeThreshold: MILLISECONDS_PER_HOUR
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() - 2 * MILLISECONDS_PER_HOUR,
  relativeThreshold: MILLISECONDS_PER_HOUR
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() - MILLISECONDS_PER_DAY,
  relativeThreshold: MILLISECONDS_PER_HOUR
})));
export const dateWithoutTime = () => /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() - MILLISECONDS_PER_WEEK,
  relativeThreshold: MILLISECONDS_PER_HOUR
});
export const dateWithTime = () => /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() - MILLISECONDS_PER_WEEK,
  relativeThreshold: MILLISECONDS_PER_HOUR,
  alwaysShowTime: true
});
export const dateInTheFutureWhenNotAllowed = () => /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.now() + 70 * MILLISECONDS_PER_DAY,
  relativeThreshold: MILLISECONDS_PER_HOUR,
  allowFutureTimestamps: false
});
export default {
  title: 'Components/ReadableTime',
  component: ReadableTime,
  parameters: {
    notes,
    chromatic: {
      disableSnapshot: true
    }
  }
};
//# sourceMappingURL=ReadableTime.stories.js.map