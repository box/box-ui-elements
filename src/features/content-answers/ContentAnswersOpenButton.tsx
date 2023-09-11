import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';

import messages from './messages';

import './ContentAnswersOpenButton.scss';

interface ContentAnswersOpenButtonProps {
    intl: IntlShape;
    onClick: () => void;
}

const ContentAnswersOpenButton = ({ intl, onClick }: ContentAnswersOpenButtonProps) => {
    const { formatMessage } = intl;

    const getTooltipText = () => {
        return formatMessage(messages.defaultTooltip);
    };

    return (
        <Tooltip text={getTooltipText()}>
            <Button
                aria-label={formatMessage(messages.contentAnswersTitle)}
                className="bdl-ContentAnswersOpenButton"
                data-testid="content-answers-open-button"
                onClick={onClick}
            >
                <BoxAiLogo width={20} height={20} />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
