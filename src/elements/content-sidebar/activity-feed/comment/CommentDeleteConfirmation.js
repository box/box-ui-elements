/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Overlay } from '../../../../components/flyout';
import PrimaryButton from '../../../../components/primary-button';
import Button from '../../../../components/button';
import commonMessages from '../../../common/messages';
import messages from './messages';
import './CommentDeleteConfirmation.scss';

import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK, KEYS } from '../../../../constants';

type Props = {
    isOpen: boolean,
    onDeleteCancel: Function,
    onDeleteConfirm: Function,
    type: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
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
        const { type, onDeleteCancel, onDeleteConfirm } = this.props;
        const deleteConfirmMessage =
            type === COMMENT_TYPE_DEFAULT ? messages.commentDeletePrompt : messages.taskDeletePrompt;

        return (
            <Overlay
                className="be-modal bcs-comment-confirm-container"
                onKeyDown={this.onKeyDown}
                shouldOutlineFocus={false}
                shouldDefaultFocus
                role="dialog"
            >
                <div className="bcs-comment-confirm-prompt">
                    <FormattedMessage {...deleteConfirmMessage} />
                </div>
                <div>
                    <Button className="bcs-comment-confirm-cancel" onClick={onDeleteCancel} type="button">
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                    <PrimaryButton className="bcs-comment-confirm-delete" onClick={onDeleteConfirm} type="button">
                        <FormattedMessage {...commonMessages.delete} />
                    </PrimaryButton>
                </div>
            </Overlay>
        );
    }
}

export default CommentDeleteConfirmation;
