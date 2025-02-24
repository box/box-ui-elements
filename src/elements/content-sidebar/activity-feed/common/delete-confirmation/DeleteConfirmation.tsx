import * as React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Button from '../../../../../components/button';
import commonMessages from '../../../../common/messages';
import PrimaryButton from '../../../../../components/primary-button';
import { KEYS } from '../../../../../constants';
import { Overlay } from '../../../../../components/flyout';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import './DeleteConfirmation.scss';

export interface DeleteConfirmationProps {
    className?: string;
    isOpen: boolean;
    message: MessageDescriptor;
    onDeleteCancel: () => void;
    onDeleteConfirm: () => void;
}

class DeleteConfirmation extends React.Component<DeleteConfirmationProps> {
    onKeyDown = (event: React.KeyboardEvent): void => {
        const { isOpen, onDeleteCancel } = this.props;

        event.stopPropagation();

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
        const { className, isOpen, message, onDeleteCancel, onDeleteConfirm, ...rest } = this.props; // eslint-disable-line @typescript-eslint/no-unused-vars
        // Destructure isOpen to prevent it from being passed to Overlay component

        return (
            <Overlay
                className="be-modal bcs-DeleteConfirmation"
                onKeyDown={this.onKeyDown}
                role="dialog"
                shouldDefaultFocus
                shouldOutlineFocus={false}
                {...rest}
            >
                <div className="bcs-DeleteConfirmation-promptMessage">
                    <FormattedMessage {...message} />
                </div>
                <div>
                    <Button
                        aria-label={commonMessages.cancel.defaultMessage}
                        className="bcs-DeleteConfirmation-cancel"
                        onClick={onDeleteCancel}
                        // @ts-ignore ButtonType will be fixed in a separate PR
                        type="button"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE_CANCEL}
                    >
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                    <PrimaryButton
                        aria-label={commonMessages.delete.defaultMessage}
                        className="bcs-DeleteConfirmation-delete"
                        onClick={onDeleteConfirm}
                        // @ts-ignore ButtonType will be fixed in a separate PR
                        type="button"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE_CONFIRM}
                    >
                        <FormattedMessage {...commonMessages.delete} />
                    </PrimaryButton>
                </div>
            </Overlay>
        );
    }
}

export default DeleteConfirmation;
