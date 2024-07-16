import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Unplugged140 from '../../illustration/Unplugged140';

import messages from './messages';

import './ContentAnswersModalError.scss';

const ContentAnswersModalError = () => {
    return (
        <div className="bdl-ContentAnswersModalError">
            <div
                className="bdl-ContentAnswersModalError-illustration"
                data-testid="content-answers-modal-error-illustration"
            >
                <Unplugged140 />
            </div>

            <h2 data-testid="content-answers-modal-error-heading">
                <FormattedMessage {...messages.intelligenceUnavailableHeading} />
            </h2>
            <p data-testid="content-answers-modal-error-description">
                <FormattedMessage {...messages.intelligenceUnavailableDescription} />
            </p>
            <p data-testid="content-answers-modal-error-tryagain">
                <FormattedMessage {...messages.intelligenceUnavailableTryAgain} />
            </p>
        </div>
    );
};

export default ContentAnswersModalError;
