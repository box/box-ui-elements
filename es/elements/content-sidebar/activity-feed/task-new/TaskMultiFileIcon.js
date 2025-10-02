import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
import Tooltip from '../../../../components/tooltip';
import MoveCopy16 from '../../../../icon/line/MoveCopy16';
const TaskMultiFileIcon = ({
  isMultiFile
}) => {
  return isMultiFile && /*#__PURE__*/React.createElement(Tooltip, {
    position: "top-center",
    text: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskMultipleFilesAffordanceTooltip)
  }, /*#__PURE__*/React.createElement(LabelPill.Pill, {
    "data-testid": "multifile-badge"
  }, /*#__PURE__*/React.createElement(LabelPill.Icon, {
    Component: MoveCopy16
  })));
};
export default TaskMultiFileIcon;
//# sourceMappingURL=TaskMultiFileIcon.js.map