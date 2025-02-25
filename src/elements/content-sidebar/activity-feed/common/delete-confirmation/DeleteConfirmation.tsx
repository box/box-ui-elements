import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage, MessageDescriptor, injectIntl } from 'react-intl';
import type { WrappedComponentProps } from 'react-intl';

import Button, { ButtonType } from '../../../../../components/button';
import commonMessages from '../../../../common/messages';
import PrimaryButton from '../../../../../components/primary-button';

import { Overlay } from '../../../../../components/flyout';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import './DeleteConfirmation.scss';

interface Props {
    /** Additional CSS class name */
    className?: string;
    /** Whether the confirmation dialog is shown */
    isOpen: boolean;
    /** Message to display in the confirmation dialog */
    message: MessageDescriptor;
    /** Callback when cancel button is clicked */
    onDeleteCancel: () => void;
    /** Callback when confirm button is clicked */
    onDeleteConfirm: () => void;
}

type DeleteConfirmationProps = Props & WrappedComponentProps;

class DeleteConfirmation extends React.Component<DeleteConfirmationProps> {
    render(): React.ReactElement | null {
        const { className, intl, isOpen, message, onDeleteCancel, onDeleteConfirm } = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            <Overlay
                className={classNames('be-modal bcs-DeleteConfirmation', className)}
                role="dialog"
                shouldDefaultFocus
                shouldOutlineFocus={false}
                data-testid="delete-confirmation"
                onClose={onDeleteCancel}
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
