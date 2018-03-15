/**
 * @flow
 * @file Inline Delete component
 */

import React, { Component, ReactNode } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import { Flyout, Overlay } from 'box-react-ui/lib/components/flyout';
import IconTrash from 'box-react-ui/lib/icons/general/IconTrash';

import messages from '../messages';

type Props = {
    onDelete: Function,
    id: string,
    intl: intlShape.isRequired,
    message: ReactNode
};

class InlineDelete extends Component<Props> {
    state = {
        isConfirming: false
    };

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
