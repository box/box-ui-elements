import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import PrimaryButton from '../../components/primary-button/PrimaryButton';

import messages from './messages';

import './MetadataInstanceConfirmDialog.scss';

interface Props {
    confirmationMessage: string | React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}

const MetadataInstanceConfirmDialog = ({ onCancel, onConfirm, confirmationMessage }: Props) => {
    const cancelButtonRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
        if (cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, []);

    return (
        <div className="metadata-instance-confirm-cover">
            <div className="metadata-instance-confim-container" role="alert">
                <p className="metadata-instance-confirm-text">{confirmationMessage}</p>
                <div className="metadata-instance-confirm-buttons">
                    <ButtonAdapter
                        ref={cancelButtonRef}
                        data-resin-target="metadata-confirmcancel"
                        onClick={onCancel}
                        type={ButtonType.BUTTON}
                    >
                        <FormattedMessage {...messages.metadataCancel} />
                    </ButtonAdapter>
                    <PrimaryButton data-resin-target="metadata-confirmremove" onClick={onConfirm} type={ButtonType.BUTTON}>
                        <FormattedMessage {...messages.customRemove} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default MetadataInstanceConfirmDialog;
