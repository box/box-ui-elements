/**
 * @flow
 * @file Inline Delete component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import PlainButton from '../../../../components/plain-button';
import { Flyout, Overlay } from '../../../../components/flyout';
import IconTrash from '../../../../icons/general/IconTrash';

import messages from '../../../common/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

type Props = {
    id: string,
    message: React.Node,
    onDelete: Function,
    permissions: BoxItemPermission,
} & InjectIntlProvidedProps;

type State = {
    isConfirming?: boolean,
};

class InlineDelete extends React.Component<Props, State> {
    state = {
        isConfirming: false,
    };

    onDeleteConfirmedHandler = (): void => {
        const { id, onDelete, permissions } = this.props;
        onDelete({ id, permissions });
    };

    handleFlyoutOpen = (): void => {
        this.setState({ isConfirming: true });
    };

    handleFlyoutClose = (): void => {
        this.setState({ isConfirming: false });
    };

    render(): React.Node {
        const { intl, message } = this.props;
        return (
            <div
                className={classNames('bcs-comment-delete-container', {
                    'bcs-is-confirming': this.state.isConfirming,
                })}
            >
                <Flyout onClose={this.handleFlyoutClose} onOpen={this.handleFlyoutOpen} position="middle-left">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.deleteLabel)}
                        className="bcs-comment-delete"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                    >
                        <IconTrash />
                    </PlainButton>
                    <Overlay>
                        <b>{message}</b>
                        <div>
                            <PlainButton
                                className="lnk bcs-comment-delete-yes"
                                onClick={this.onDeleteConfirmedHandler}
                                type="button"
                            >
                                <FormattedMessage {...messages.commentDeleteConfirm} />
                            </PlainButton>
                            {' / '}
                            <PlainButton className="lnk bcs-comment-delete-no" type="button">
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
