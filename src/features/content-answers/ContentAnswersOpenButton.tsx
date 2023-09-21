import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import { CODE_FILE_EXTENSIONS, DOCUMENT_FILE_EXTENSIONS, TEXT_FILE_EXTENSIONS } from './constants';

import messages from './messages';

import './ContentAnswersOpenButton.scss';

interface ContentAnswersOpenButtonProps {
    fileExtension: string;
    intl: IntlShape;
    onClick: () => void;
}

const ContentAnswersOpenButton = ({ fileExtension, intl, onClick }: ContentAnswersOpenButtonProps) => {
    const { formatMessage } = intl;

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

    return (
        <Tooltip text={getTooltipText()}>
            <Button
                aria-label={formatMessage(messages.contentAnswersTitle)}
                className="bdl-ContentAnswersOpenButton"
                data-testid="content-answers-open-button"
                isDisabled={!isAllowedFileType(fileExtension)}
                onClick={onClick}
            >
                <BoxAiLogo width={20} height={20} />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
