import React, { useEffect } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';

import { IconButton, Tooltip } from '@box/blueprint-web';
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';

import { CODE_FILE_EXTENSIONS, DOCUMENT_FILE_EXTENSIONS, TEXT_FILE_EXTENSIONS } from './constants';

import messages from './messages';

import './ContentAnswersOpenButton.scss';

interface ContentAnswersOpenButtonProps {
    fileExtension: string;
    intl: IntlShape;
    isHighlighted: boolean;
    isModalOpen: boolean;
    onClick: () => void;
}

const ContentAnswersOpenButton = ({
    fileExtension,
    intl,
    isHighlighted,
    isModalOpen,
    onClick,
}: ContentAnswersOpenButtonProps) => {
    const { formatMessage } = intl;
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (isHighlighted && !isModalOpen && buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [isHighlighted, isModalOpen]);

    const isAllowedFileType = (extension: string) => {
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

    const openButtonClassNames = classNames('bdl-ContentAnswersOpenButton', {
        'bdl-ContentAnswersOpenButton--hasQuestions': isHighlighted,
    });
    return (
        <Tooltip content={getTooltipText()}>
            <IconButton
                aria-label={formatMessage(messages.contentAnswersTitle)}
                className={openButtonClassNames}
                disabled={!isAllowedFileType(fileExtension)}
                onClick={onClick}
                ref={buttonRef}
                icon={BoxAiLogo}
                variant="icon-logo"
            />
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
