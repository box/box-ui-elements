/**
 * 
 * @file Timeline component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconTrackNext from '../../../../icons/general/IconTrackNext';
import IconTrackPrevious from '../../../../icons/general/IconTrackPrevious';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import Timeslice from './Timeslice';
import { isValidStartTime } from '../transcript/timeSliceUtils';
import './Timeline.scss';
const Timeline = ({
  text = '',
  duration = 0,
  timeslices = [],
  getViewer,
  interactionTarget
}) => {
  let timeSliceIndex = -1;
  const playSegment = (index, incr = 0) => {
    const newIndex = incr > 0 ? Math.min(timeslices.length - 1, index + incr) : Math.max(0, index + incr);
    const viewer = getViewer ? getViewer() : null;
    const timeslice = timeslices[newIndex];
    const validTime = isValidStartTime(timeslice);
    if (validTime && viewer && typeof viewer.play === 'function') {
      viewer.play(timeslice.start);
      timeSliceIndex = newIndex;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "be-timeline"
  }, text && /*#__PURE__*/React.createElement("div", {
    className: "be-timeline-label"
  }, text), /*#__PURE__*/React.createElement("div", {
    className: "be-timeline-line-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "be-timeline-line"
  }), timeslices.map(({
    start,
    end
  }, index) =>
  /*#__PURE__*/
  /* eslint-disable react/no-array-index-key */
  React.createElement(Timeslice, {
    key: index,
    duration: duration,
    end: end,
    index: index,
    interactionTarget: interactionTarget,
    onClick: playSegment,
    start: start
  })
  /* eslint-enable react/no-array-index-key */)), /*#__PURE__*/React.createElement("div", {
    className: "be-timeline-btns"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    "data-resin-target": SKILLS_TARGETS.TIMELINE.PREVIOUS,
    onClick: () => playSegment(timeSliceIndex, -1),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconTrackPrevious, {
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.previousSegment)
  })), /*#__PURE__*/React.createElement(PlainButton, {
    "data-resin-target": SKILLS_TARGETS.TIMELINE.NEXT,
    onClick: () => playSegment(timeSliceIndex, 1),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconTrackNext, {
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.nextSegment)
  }))));
};
export default Timeline;
//# sourceMappingURL=Timeline.js.map