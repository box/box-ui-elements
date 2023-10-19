import React from 'react';

import { FormattedMessage } from 'react-intl';
import { QuestionType } from './ContentAnswersModal';
import { Button } from '../../components';

import messages from './messages';

import './ContentAnswersModalFooterActions.scss';

interface Props {
    lastQuestion: QuestionType | null;
    onRetryResponse: Function;
}

const ContentAnswersModalFooterActions = ({ lastQuestion, onRetryResponse }: Props) => {
    const shouldShowRetryButton = lastQuestion && lastQuestion.error;
    const retryButtonRef = React.useRef<HTMLButtonElement | null>(null);

    const handleRetryClick = React.useCallback(() => {
        onRetryResponse(lastQuestion);
    }, [lastQuestion, onRetryResponse]);

    React.useEffect(() => {
        if (retryButtonRef.current) {
            setTimeout(() => {
                if (retryButtonRef.current) {
                    // typescript doesnt know about the if statement above the setTimeout... so it throws a type error
                    retryButtonRef.current.focus();
                }
            }, 0);
        }
    }, [retryButtonRef]);

    if (!shouldShowRetryButton) {
        return null;
    }

    return (
        <div className="bdl-ContentAnswersModalFooterActions" data-testid="content-answers-modal-footer-actions">
            {shouldShowRetryButton && (
                <Button
                    setRef={(ref: HTMLButtonElement) => {
                        retryButtonRef.current = ref;
                    }}
                    className="bdl-ContentAnswersModalFooterActions-Button"
                    data-testid="content-answers-retry-response-button"
                    onClick={handleRetryClick}
                >
                    <FormattedMessage {...messages.retryResponse} />
                </Button>
            )}
        </div>
    );
};

export default ContentAnswersModalFooterActions;
