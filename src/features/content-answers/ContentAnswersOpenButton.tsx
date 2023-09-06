import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import BoxAIIconColor from '../../icon/logo/BoxAiLogo';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';

import messages from './messages';

import './ContentAnswersOpenButton.scss';

interface Props {
    handleClick: Function;
    intl: IntlShape;
}

const ContentAnswersOpenButton = ({ handleClick, intl }: Props) => {
    const getTooltipText = () => {
        return intl.formatMessage(messages.defaultTooltip);
    };

    return (
        <Tooltip className="ContentAnswersOpenButton-tooltip" text={getTooltipText()}>
            <Button
                className="ContentAnswersOpenButton"
                data-testid="content-answers-open-button"
                onClick={handleClick}
            >
                <BoxAIIconColor className="BoxAIIconColor" />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ContentAnswersOpenButton);
