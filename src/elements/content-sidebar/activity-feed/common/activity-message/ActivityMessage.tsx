import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import CollapsableMessage from './CollapsableMessage';
import formatTaggedMessage from '../../utils/formatTaggedMessage';
import LoadingIndicator, { LoadingIndicatorSize } from '../../../../../components/loading-indicator';
import messages from './messages';
import ShowOriginalButton from './ShowOriginalButton';
import TranslateButton from './TranslateButton';
import { withFeatureConsumer, isFeatureEnabled } from '../../../../common/feature-checking';

import type { GetProfileUrlCallback } from '../../../../common/flowTypes';
import type { FeatureConfig } from '../../../../common/feature-checking';

import './ActivityMessage.scss';

interface Props {
    features: FeatureConfig;
    getUserProfileUrl?: GetProfileUrlCallback;
    id: string;
    isEdited?: boolean;
    onTranslate?: (args: { id: string; tagged_message: string }) => void;
    tagged_message: string;
    translatedTaggedMessage?: string;
    translationEnabled?: boolean;
    translationFailed?: boolean | null;
}

interface State {
    isLoading?: boolean;
    isTranslation?: boolean;
}

class ActivityMessage extends React.Component<Props, State> {
    static defaultProps = {
        isEdited: false,
        translationEnabled: false,
    };

    state = {
        isLoading: false,
        isTranslation: false,
    };

    componentDidUpdate(prevProps: Props): void {
        const { translatedTaggedMessage, translationFailed } = this.props;
        const { translatedTaggedMessage: prevTaggedMessage, translationFailed: prevTranslationFailed } = prevProps;

        if (prevTaggedMessage === translatedTaggedMessage || prevTranslationFailed === translationFailed) {
            return;
        }

        if (translatedTaggedMessage || translationFailed) {
            this.setState({ isLoading: false });
        }
    }

    getButton(isTranslation?: boolean): React.ReactNode {
        if (isTranslation) {
            return <ShowOriginalButton handleShowOriginal={this.handleShowOriginal} />;
        }
        return <TranslateButton handleTranslate={this.handleTranslate} />;
    }

    handleTranslate = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        const { id, tagged_message, onTranslate = noop, translatedTaggedMessage } = this.props;
        if (!translatedTaggedMessage) {
            this.setState({ isLoading: true });
            onTranslate({ id, tagged_message });
        }

        this.setState({ isTranslation: true });
        event.preventDefault();
    };

    handleShowOriginal = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        this.setState({ isTranslation: false });
        event.preventDefault();
    };

    render(): React.ReactNode {
        const {
            features,
            getUserProfileUrl,
            id,
            isEdited,
            tagged_message,
            translatedTaggedMessage,
            translationEnabled,
        } = this.props;
        const { isLoading, isTranslation } = this.state;
        const commentToDisplay =
            translationEnabled && isTranslation && translatedTaggedMessage ? translatedTaggedMessage : tagged_message;
        const MessageWrapper = isFeatureEnabled(features, 'activityFeed.collapsableMessages.enabled')
            ? CollapsableMessage
            : React.Fragment;

        return isLoading ? (
            <div className="bcs-ActivityMessageLoading">
                <LoadingIndicator size={LoadingIndicatorSize.SMALL} />
            </div>
        ) : (
            <div className="bcs-ActivityMessage">
                <MessageWrapper>
                    {formatTaggedMessage(commentToDisplay, id, false, getUserProfileUrl)}
                    {isEdited && (
                        <span className="bcs-ActivityMessage-edited">
                            <FormattedMessage {...messages.activityMessageEdited} />
                        </span>
                    )}
                </MessageWrapper>
                {translationEnabled ? this.getButton(isTranslation) : null}
            </div>
        );
    }
}

export { ActivityMessage };
export default withFeatureConsumer<Props>(ActivityMessage);
