// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import LoadingIndicator from '../../../../../components/loading-indicator';
import formatTaggedMessage from '../../utils/formatTaggedMessage';
import ShowOriginalButton from './ShowOriginalButton';
import TranslateButton from './TranslateButton';
import TruncatableMessage from './TruncatableMessage';
import type { GetProfileUrlCallback } from '../../../../common/flowTypes';
import messages from './messages';
import './ActivityMessage.scss';

type Props = {
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isEdited?: boolean,
    onTranslate?: Function,
    shouldTruncate?: boolean,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translationEnabled?: boolean,
    translationFailed?: ?boolean,
};

type State = {
    isLoading?: boolean,
    isTranslation?: boolean,
};

class ActivityMessage extends React.Component<Props, State> {
    static defaultProps = {
        isEdited: false,
        translationEnabled: false,
        shouldTruncate: false,
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

    getButton(isTranslation?: boolean): React.Node {
        let button = null;
        if (isTranslation) {
            button = <ShowOriginalButton handleShowOriginal={this.handleShowOriginal} />;
        } else {
            button = <TranslateButton handleTranslate={this.handleTranslate} />;
        }

        return button;
    }

    handleTranslate = (event: SyntheticMouseEvent<>): void => {
        const { id, tagged_message, onTranslate = noop, translatedTaggedMessage } = this.props;
        if (!translatedTaggedMessage) {
            this.setState({ isLoading: true });
            onTranslate({ id, tagged_message });
        }

        this.setState({ isTranslation: true });
        event.preventDefault();
    };

    handleShowOriginal = (event: SyntheticMouseEvent<>): void => {
        this.setState({ isTranslation: false });
        event.preventDefault();
    };

    render(): React.Node {
        const {
            id,
            isEdited,
            tagged_message,
            translatedTaggedMessage,
            translationEnabled,
            getUserProfileUrl,
        } = this.props;
        const { isLoading, isTranslation } = this.state;
        const commentToDisplay =
            translationEnabled && isTranslation && translatedTaggedMessage ? translatedTaggedMessage : tagged_message;
        const MessageWrapper = this.props.shouldTruncate ? TruncatableMessage : React.Fragment;

        return isLoading ? (
            <div className="bcs-ActivityMessageLoading">
                <LoadingIndicator size="small" />
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

export default ActivityMessage;
