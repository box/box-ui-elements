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

import messages from '../../../messages';

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

    onDeleteConfirmedHandler = (): void => {
        const { id, onDelete } = this.props;
        onDelete({ id });
    };

    handleFlyoutOpen = (): void => {
        this.setState({ isConfirming: true });
    };

    handleFlyoutClose = (): void => {
        this.setState({ isConfirming: false });
    };

    render(): ReactNode {
        const { intl, message } = this.props;
        return (
            <div
                className={classNames('bcs-comment-delete-container', {
                    'bcs-is-confirming': this.state.isConfirming
                })}
            >
                <Flyout onClose={this.handleFlyoutClose} onOpen={this.handleFlyoutOpen} position='middle-left'>
                    <PlainButton aria-label={intl.formatMessage(messages.deleteLabel)} className='bcs-comment-delete'>
                        <IconTrash />
                    </PlainButton>
                    <Overlay>
                        <b>{message}</b>
                        <div>
                            <PlainButton
                                className='lnk bcs-comment-delete-yes'
                                onClick={this.onDeleteConfirmedHandler}
                                type='button'
                            >
                                <FormattedMessage {...messages.commentDeleteConfirm} />
                            </PlainButton>
                            {' / '}
                            <PlainButton className='lnk bcs-comment-delete-no' type='button'>
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
