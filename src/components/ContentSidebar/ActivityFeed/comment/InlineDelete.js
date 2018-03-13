import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import PlainButton from '../../../components/plain-button';
import { Flyout, Overlay } from '../../../components/flyout';
import IconTrash from '../../../icons/general/IconTrash';

import messages from '../messages';

class InlineDelete extends Component {
    static propTypes = {
        onDelete: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        intl: intlShape.isRequired,
        message: PropTypes.node.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isConfirming: false
        };
    }

    onDeleteConfirmedHandler = () => {
        const { id, onDelete } = this.props;
        onDelete({ id });
    };

    handleFlyoutOpen = () => {
        this.setState({ isConfirming: true });
    };

    handleFlyoutClose = () => {
        this.setState({ isConfirming: false });
    };

    render() {
        const { intl, message } = this.props;
        return (
            <div
                className={classNames('box-ui-comment-delete-container', {
                    'is-confirming': this.state.isConfirming
                })}
            >
                <Flyout onClose={this.handleFlyoutClose} onOpen={this.handleFlyoutOpen} position='middle-left'>
                    <PlainButton
                        aria-label={intl.formatMessage(messages.deleteLabel)}
                        className='box-ui-comment-delete'
                    >
                        <IconTrash />
                    </PlainButton>
                    <Overlay>
                        <b>{message}</b>
                        <div>
                            <PlainButton
                                className='lnk box-ui-comment-delete-yes'
                                onClick={this.onDeleteConfirmedHandler}
                                type='button'
                            >
                                <FormattedMessage {...messages.commentDeleteConfirm} />
                            </PlainButton>
                            {' / '}
                            <PlainButton className='lnk box-ui-comment-delete-no' type='button'>
                                <FormattedMessage {...messages.commentDeleteCancel} />
                            </PlainButton>
                        </div>
                    </Overlay>
                </Flyout>
            </div>
        );
    }
}

export { InlineDelete as InlineDeleteBase };
export default injectIntl(InlineDelete);
