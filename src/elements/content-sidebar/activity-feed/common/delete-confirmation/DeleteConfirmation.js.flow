/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import Button from '../../../../../components/button';
import commonMessages from '../../../../common/messages';
import PrimaryButton from '../../../../../components/primary-button';
import { KEYS } from '../../../../../constants';
import { Overlay } from '../../../../../components/flyout';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import './DeleteConfirmation.scss';

type Props = {
    isOpen: boolean,
    message: MessageDescriptor,
    onDeleteCancel: Function,
    onDeleteConfirm: Function,
};

class DeleteConfirmation extends React.Component<Props> {
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
        const { isOpen, message, onDeleteCancel, onDeleteConfirm, ...rest } = this.props;

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
                        type="button"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE_CANCEL}
                    >
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                    <PrimaryButton
                        aria-label={commonMessages.delete.defaultMessage}
                        className="bcs-DeleteConfirmation-delete"
                        onClick={onDeleteConfirm}
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
