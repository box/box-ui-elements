import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
import { CODE_FILE_EXTENSIONS, DOCUMENT_FILE_EXTENSIONS, TEXT_FILE_EXTENSIONS } from './constants';
import messages from './messages';
import './ContentAnswersOpenButton.scss';
const ContentAnswersOpenButton = ({
  fileExtension,
  intl,
  isHighlighted,
  isModalOpen,
  onClick
}) => {
  const {
    formatMessage
  } = intl;
  const buttonRef = React.useRef(null);
  useEffect(() => {
    if (isHighlighted && !isModalOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isHighlighted, isModalOpen]);
  const isAllowedFileType = extension => {
    const allowedTypes = [...CODE_FILE_EXTENSIONS, ...DOCUMENT_FILE_EXTENSIONS, ...TEXT_FILE_EXTENSIONS];
    return allowedTypes.includes(extension);
  };
  const getTooltipText = () => {
    if (isHighlighted) {
      return formatMessage(messages.hasQuestionsTooltip);
    }
    if (!isAllowedFileType(fileExtension)) {
      return formatMessage(messages.disabledTooltipFileNotCompatible);
    }
    return formatMessage(messages.defaultTooltip);
  };
  const openButtonClassNames = classNames('be-ContentAnswersOpenButton', {
    'be-ContentAnswersOpenButton--hasQuestions': isHighlighted
  });
  return /*#__PURE__*/React.createElement(Tooltip, {
    content: getTooltipText()
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.contentAnswersTitle),
    className: openButtonClassNames,
    disabled: !isAllowedFileType(fileExtension),
    onClick: onClick,
    ref: buttonRef,
    icon: BoxAiLogo,
    variant: "icon-logo"
  }));
};
export default injectIntl(ContentAnswersOpenButton);
//# sourceMappingURL=ContentAnswersOpenButton.js.map