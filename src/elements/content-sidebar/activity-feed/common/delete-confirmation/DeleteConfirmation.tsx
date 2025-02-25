import * as React from 'react';
import { FormattedMessage, MessageDescriptor, injectIntl } from 'react-intl';
import type { WrappedComponentProps } from 'react-intl';

import Button, { ButtonType } from '../../../../../components/button';
import commonMessages from '../../../../common/messages';
import PrimaryButton from '../../../../../components/primary-button';
import { KEYS } from '../../../../../constants';
import { Overlay } from '../../../../../components/flyout';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import './DeleteConfirmation.scss';

interface Props {
    isOpen: boolean;
    message: MessageDescriptor;
    onDeleteCancel: () => void;
    onDeleteConfirm: () => void;
}

type DeleteConfirmationProps = Props & WrappedComponentProps;

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
        const { intl, isOpen, message, onDeleteCancel, onDeleteConfirm, ...rest } = this.props; // eslint-disable-line @typescript-eslint/no-unused-vars
        // Destructure isOpen to prevent it from being passed to Overlay component since it's not a valid prop

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
                        aria-label={intl.formatMessage(commonMessages.cancel)}
                        className="bcs-DeleteConfirmation-cancel"
                        onClick={onDeleteCancel}
                        type={ButtonType.BUTTON}
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE_CANCEL}
                    >
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                    <PrimaryButton
                        aria-label={intl.formatMessage(commonMessages.delete)}
                        className="bcs-DeleteConfirmation-delete"
                        onClick={onDeleteConfirm}
                        type={ButtonType.BUTTON}
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE_CONFIRM}
                    >
                        <FormattedMessage {...commonMessages.delete} />
                    </PrimaryButton>
                </div>
            </Overlay>
        );
    }
}

export { DeleteConfirmation as DeleteConfirmationBase };
export default injectIntl(DeleteConfirmation);
