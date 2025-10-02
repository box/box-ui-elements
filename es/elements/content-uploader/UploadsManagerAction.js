import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import { RESIN_TAG_TARGET } from '../../common/variables';
import { STATUS_ERROR } from '../../constants';
import messages from '../common/messages';
import './UploadsManagerAction.scss';
const UploadsManagerAction = ({
  hasMultipleFailedUploads,
  onClick
}) => {
  const {
    formatMessage
  } = useIntl();
  const handleResumeClick = event => {
    event.stopPropagation();
    onClick(STATUS_ERROR);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-uploads-manager-action"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "bcu-UploadsManagerAction-button",
    onClick: handleResumeClick,
    [RESIN_TAG_TARGET]: 'uploadresumeheader'
  }, formatMessage(hasMultipleFailedUploads ? messages.resumeAll : messages.resume)));
};
export default UploadsManagerAction;
//# sourceMappingURL=UploadsManagerAction.js.map