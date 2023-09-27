import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContentAnswersGridCard from './ContentAnswersGridCard';

import messages from '../messages';

import './WelcomeMessage.scss';

type Props = {
    fileName: string;
};

const WelcomeMessage = ({ fileName }: Props) => {
    return (
        <div className="WelcomeMessage" data-testid="content-answers-welcome-message">
            <ContentAnswersGridCard>
                <div className="WelcomeMessage-title">
                    <FormattedMessage {...messages.welcomeMessageTitle} />
                </div>
                <div className="WelcomeMessage-askQuestionText">
                    <FormattedMessage {...messages.welcomeAskQuestionText} values={{ name: <b>“{fileName}”</b> }} />
                </div>
                <div className="WelcomeMessage-clearChatText">
                    <FormattedMessage {...messages.welcomeClearChatText} />
                </div>
            </ContentAnswersGridCard>
        </div>
    );
};

export default WelcomeMessage;
