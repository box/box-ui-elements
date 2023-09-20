import React, { useState } from 'react';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';

import Avatar from '../../components/avatar';
import PrimaryButton from '../../components/primary-button';
// @ts-ignore flow import
import TextArea from '../../components/text-area';
import { TEXT_AREA } from './constants';

import './ContentAnswersModalFooter.scss';

import messages from './messages';

type Props = {
    intl: IntlShape;
};

const ContentAnswersModalFooter = ({ intl }: Props) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [hasMaxCharacterError, setHasMaxCharacterError] = useState(false);

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        let currentInput = event.currentTarget.value;
        if (currentInput.length > TEXT_AREA.MAX_LENGTH) {
            currentInput = currentInput.slice(0, TEXT_AREA.MAX_LENGTH);
        }
        setInputMessage(currentInput);
        setHasMaxCharacterError(currentInput.length >= TEXT_AREA.MAX_LENGTH);
        setIsSubmitDisabled(currentInput.trim().length === 0);
    };

    return (
        <div className="ContentAnswersModalFooter">
            <div className="ContentAnswersModalFooter-avatar">
                <Avatar />
            </div>
            <TextArea
                data-testid="content-answers-question-input"
                error={
                    hasMaxCharacterError &&
                    intl.formatMessage(messages.maxCharactersReachedError, {
                        characterLimit: TEXT_AREA.MAX_LENGTH,
                    })
                }
                hideLabel
                label={intl.formatMessage(messages.askQuestionPlaceholder)}
                maxLength={TEXT_AREA.MAX_LENGTH}
                onChange={handleInputChange}
                placeholder={intl.formatMessage(messages.askQuestionPlaceholder)}
                value={inputMessage}
            />
            <PrimaryButton
                className="ContentAnswersModalFooter-submitButton"
                data-testid="content-answers-submit-button"
                isDisabled={isSubmitDisabled}
            >
                <FormattedMessage {...messages.ask} />
            </PrimaryButton>
        </div>
    );
};

export default injectIntl(ContentAnswersModalFooter);
