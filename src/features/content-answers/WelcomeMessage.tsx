import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ContentAnswersGridCard from './ContentAnswersGridCard';

import messages from './messages';

import './WelcomeMessage.scss';

type Props = {
    fileName: string;
};

const WelcomeMessage = ({ fileName }: Props) => {
    return (
        <div className="bdl-WelcomeMessage" data-testid="content-answers-welcome-message">
            <ContentAnswersGridCard>
                <div className="bdl-WelcomeMessage-title">
                    <FormattedMessage {...messages.welcomeMessageTitle} />
                </div>
                <div className="bdl-WelcomeMessage-askQuestionText">
                    <FormattedMessage
                        {...messages.welcomeAskQuestionText}
                        values={{ name: <b data-testid="content-answers-filename">&quot;{fileName}&quot;</b> }}
                    />
                </div>
                <div className="bdl-WelcomeMessage-clearChatText">
                    <FormattedMessage {...messages.welcomeClearChatText} />
                </div>
            </ContentAnswersGridCard>
        </div>
    );
};

export default WelcomeMessage;
