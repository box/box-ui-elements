import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import { CODE_FILE_EXTENSIONS, DOCUMENT_FILE_EXTENSIONS, TEXT_FILE_EXTENSIONS } from './constants';

import messages from './messages';

import './ContentAnswersOpenButton.scss';

interface ContentAnswersOpenButtonProps {
    intl: IntlShape;
    onClick: () => void;
    fileExtension: string;
}

const ContentAnswersOpenButton = ({ intl, onClick, fileExtension }: ContentAnswersOpenButtonProps) => {
    const { formatMessage } = intl;

    const isAllowedFileType = (extension: string) => {
        const allowedTypes = CODE_FILE_EXTENSIONS.concat(DOCUMENT_FILE_EXTENSIONS).concat(TEXT_FILE_EXTENSIONS);
        return allowedTypes.indexOf(extension) !== -1;
    };

    const getTooltipText = () => {
        if (!isAllowedFileType(fileExtension)) {
            return intl.formatMessage(messages.disabledTooltipFileNotCompatible);
        }

        return formatMessage(messages.defaultTooltip);
    };

    return (
        <Tooltip text={getTooltipText()}>
            <Button
                aria-label={formatMessage(messages.contentAnswersTitle)}
                className="bdl-ContentAnswersOpenButton"
                data-testid="content-answers-open-button"
                onClick={onClick}
                isDisabled={!isAllowedFileType(fileExtension)}
            >
                <BoxAiLogo width={20} height={20} />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
