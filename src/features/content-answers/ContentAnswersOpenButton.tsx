import React, { useEffect } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
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
        if (!isAllowedFileType(fileExtension)) {
            return formatMessage(messages.disabledTooltipFileNotCompatible);
        }

        return formatMessage(messages.defaultTooltip);
    };

    const openButtonClassNames = classNames('bdl-ContentAnswersOpenButton', {
        'bdl-ContentAnswersOpenButton--hasQuestions': isHighlighted,
    });
    return (
        <Tooltip className="bdl-ContentAnswersOpenButton-tooltip" text={getTooltipText()}>
            <Button
                aria-label={formatMessage(messages.contentAnswersTitle)}
                className={openButtonClassNames}
                data-testid="content-answers-open-button"
                isDisabled={!isAllowedFileType(fileExtension)}
                onClick={onClick}
                setRef={(ref: HTMLButtonElement) => {
                    buttonRef.current = ref;
                }}
            >
                <BoxAiLogo className="bdl-BoxAIIcon" width={20} height={20} />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
