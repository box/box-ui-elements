/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import Button from '../../../../components/button';
import commonMessages from '../../../common/messages';
import PrimaryButton from '../../../../components/primary-button';
import { KEYS } from '../../../../constants';
import { Overlay } from '../../../../components/flyout';
import './CommentDeleteConfirmation.scss';

type Props = {
    isOpen: boolean,
    message: MessageDescriptor,
    onDeleteCancel: Function,
    onDeleteConfirm: Function,
};

class CommentDeleteConfirmation extends React.Component<Props> {
    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        const { isOpen, onDeleteCancel } = this.props;

        nativeEvent.stopImmediatePropagation();

        switch (event.key) {
            case KEYS.escape:
                event.stopPropagation();
                event.preventDefault();
                if (isOpen) {
                    onDeleteCancel();
                }
                break;
            default:
                break;
        }
    };

    render() {
        const { message, onDeleteCancel, onDeleteConfirm } = this.props;

        return (
            <Overlay
                className="be-modal bcs-CommentDeleteConfirmation"
                onKeyDown={this.onKeyDown}
                role="dialog"
                shouldDefaultFocus
                shouldOutlineFocus={false}
            >
                <div className="bcs-CommentDeleteConfirmation-prompt">
                    <FormattedMessage {...message} />
                </div>
                <div>
                    <Button className="bcs-CommentDeleteConfirmation-cancel" onClick={onDeleteCancel} type="button">
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                    <PrimaryButton
                        className="bcs-CommentDeleteConfirmation-delete"
                        onClick={onDeleteConfirm}
                        type="button"
                    >
                        <FormattedMessage {...commonMessages.delete} />
                    </PrimaryButton>
                </div>
            </Overlay>
        );
    }
}

export default CommentDeleteConfirmation;
