/**
 * @flow
 * @file Comment Text component used by Comment component
 */

import React, { Component } from 'react';

import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator';

import formatTaggedMessage from '../utils/formatTaggedMessage';
import ShowOriginalButton from './ShowOriginalButton';
import TranslateButton from './TranslateButton';

type Props = {
    id: string,
    taggedMessage: string,
    translatedTaggedMessage: string,
    translationEnabled: boolean,
    onTranslate: Function,
    translationFailed: boolean
};

class CommentText extends Component<Props> {
    static defaultProps = {
        translationEnabled: false
    };

    state = {
        isLoading: false,
        isTranslation: false
    };

    componentWillReceiveProps(nextProps) {
        const { translatedTaggedMessage, translationFailed } = nextProps;
        if (translatedTaggedMessage || translationFailed) {
            this.setState({ isLoading: false });
        }
    }

    getButton(isTranslation) {
        let button = null;
        if (isTranslation) {
            button = <ShowOriginalButton handleShowOriginal={this.handleShowOriginal} />;
        } else {
            button = <TranslateButton handleTranslate={this.handleTranslate} />;
        }
        return button;
    }

    handleTranslate = (event) => {
        const { id, taggedMessage, onTranslate, translatedTaggedMessage } = this.props;
        if (!translatedTaggedMessage) {
            this.setState({ isLoading: true });
            onTranslate({ id, taggedMessage });
        }
        this.setState({ isTranslation: true });
        event.preventDefault();
    };

    handleShowOriginal = (event) => {
        this.setState({ isTranslation: false });
        event.preventDefault();
    };

    render() {
        const { id, taggedMessage, translatedTaggedMessage, translationEnabled } = this.props;
        const { isLoading, isTranslation } = this.state;
        const commentToDisplay =
            translationEnabled && isTranslation && translatedTaggedMessage ? translatedTaggedMessage : taggedMessage;
        return isLoading ? (
            <div className='box-ui-comment-text-loading'>
                <LoadingIndicator size='small' />
            </div>
        ) : (
            <div className='box-ui-comment-text'>
                {formatTaggedMessage(commentToDisplay, id, false)}
                {translationEnabled ? this.getButton(isTranslation) : null}
            </div>
        );
    }
}

export default CommentText;
