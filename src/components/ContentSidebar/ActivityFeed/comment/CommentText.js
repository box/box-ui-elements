import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from '../../../components/loading-indicator';

import PlainButton from '../../../components/plain-button';
import formatTaggedMessage from '../utils/formatTaggedMessage';

import messages from '../messages';

const TranslateButton = ({ handleTranslate }) => (
    <PlainButton className='box-ui-comment-translate' onClick={handleTranslate}>
        <FormattedMessage {...messages.commentTranslate} />
    </PlainButton>
);

TranslateButton.propTypes = {
    handleTranslate: PropTypes.func
};

const ShowOriginalButton = ({ handleShowOriginal }) => (
    <PlainButton className='box-ui-comment-translate' onClick={handleShowOriginal}>
        <FormattedMessage {...messages.commentShowOriginal} />
    </PlainButton>
);

ShowOriginalButton.propTypes = {
    handleShowOriginal: PropTypes.func
};

class CommentText extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        taggedMessage: PropTypes.string.isRequired,
        translatedTaggedMessage: PropTypes.string,
        translationEnabled: PropTypes.bool,
        onTranslate: PropTypes.func,
        translationFailed: PropTypes.bool
    };

    static defaultProps = {
        translationEnabled: false
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isTranslation: false
        };
    }

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
