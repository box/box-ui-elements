import React, { useState } from 'react';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';

import Avatar from '../../components/avatar';
import PrimaryButton from '../../components/primary-button';
// @ts-ignore flow import
import TextArea from '../../components/text-area';
import { TEXT_AREA } from './constants';
import withCurrentUser from '../../elements/common/current-user';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem, User } from '../../../common/types/core';

import './ContentAnswersModalFooter.scss';

import messages from './messages';

type Props = {
    file: BoxItem;
    currentUser?: User;
    intl: IntlShape;
};

const ContentAnswersModalFooter = ({ currentUser, intl }: Props) => {
    const { formatMessage } = intl;
    const { id, name } = currentUser || {};
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
        <div className="bdl-ContentAnswersModalFooter">
            <div className="bdl-ContentAnswersModalFooter-avatar">
                <Avatar id={id} name={name} />
            </div>
            <TextArea
                data-testid="content-answers-question-input"
                error={
                    hasMaxCharacterError &&
                    formatMessage(messages.maxCharactersReachedError, {
                        characterLimit: TEXT_AREA.MAX_LENGTH,
                    })
                }
                hideLabel
                label={formatMessage(messages.askQuestionPlaceholder)}
                maxLength={TEXT_AREA.MAX_LENGTH}
                onChange={handleInputChange}
                placeholder={formatMessage(messages.askQuestionPlaceholder)}
                value={inputMessage}
            />
            <PrimaryButton
                className="bdl-ContentAnswersModalFooter-submitButton"
                data-testid="content-answers-submit-button"
                isDisabled={isSubmitDisabled}
            >
                <FormattedMessage {...messages.ask} />
            </PrimaryButton>
        </div>
    );
};

export default withCurrentUser(injectIntl(ContentAnswersModalFooter));
