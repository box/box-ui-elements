/**
 * 
 * @file Transcript row component
 * @author Box
 */

import * as React from 'react';
import { formatTime } from '../../../../utils/datetime';
import ReadOnlyTranscriptRow from './ReadOnlyTranscriptRow';
import EditingTranscriptRow from './EditingTranscriptRow';
import { isValidTimeSlice } from './timeSliceUtils';
import './TranscriptRow.scss';
const TranscriptRow = ({
  appears,
  text,
  isEditing,
  onClick,
  onSave,
  onCancel,
  onChange,
  interactionTarget
}) => {
  const isValid = isValidTimeSlice(appears) && Array.isArray(appears) && appears.length === 1;
  const timeSlice = appears;
  const start = isValid ? formatTime(timeSlice[0].start) : undefined;
  return isEditing ? /*#__PURE__*/React.createElement(EditingTranscriptRow, {
    onCancel: onCancel,
    onChange: onChange,
    onSave: onSave,
    text: text,
    time: start
  }) : /*#__PURE__*/React.createElement(ReadOnlyTranscriptRow, {
    interactionTarget: interactionTarget,
    onClick: onClick,
    text: text,
    time: start
  });
};
export default TranscriptRow;
//# sourceMappingURL=TranscriptRow.js.map