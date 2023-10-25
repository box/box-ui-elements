import React from 'react';

import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';

import messages from './messages';

import './ContentAnswersModalFooterActions.scss';

interface Props {
    hasError: boolean;
    onRetry: Function;
}

const ContentAnswersModalFooterActions = ({ hasError, onRetry }: Props) => {
    const retryButtonRef = React.useRef<HTMLButtonElement | null>(null);

    const handleRetryClick = React.useCallback(() => {
        onRetry();
    }, [onRetry]);

    React.useEffect(() => {
        if (retryButtonRef.current) {
            if (hasError) {
                retryButtonRef.current.focus();
            }
        }
    }, [retryButtonRef, hasError]);

    if (!hasError) {
        return null;
    }

    return (
        <div className="bdl-ContentAnswersModalFooterActions" data-testid="content-answers-modal-footer-actions">
            <Button
                setRef={(ref: HTMLButtonElement) => {
                    retryButtonRef.current = ref;
                }}
                className="bdl-ContentAnswersModalFooterActions-button"
                data-testid="content-answers-retry-button"
                onClick={handleRetryClick}
            >
                <FormattedMessage {...messages.retryResponse} />
            </Button>
        </div>
    );
};

export default ContentAnswersModalFooterActions;
