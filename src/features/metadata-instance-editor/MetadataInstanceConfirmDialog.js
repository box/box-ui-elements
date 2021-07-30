// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../components/button/Button';
import PrimaryButton from '../../components/primary-button/PrimaryButton';

import messages from './messages';

import './MetadataInstanceConfirmDialog.scss';

type Props = {
    confirmationMessage: string | React.Node,
    onCancel: Function,
    onConfirm: Function,
};

const MetadataInstanceConfirmDialog = ({ onCancel, onConfirm, confirmationMessage }: Props) => {
    const cancelButtonRef = React.useRef<any | null>(null);

    React.useEffect(() => {
        if (cancelButtonRef.current) {
            cancelButtonRef.current.btnElement.focus();
        }
    }, []);

    return (
        <div className="metadata-instance-confirm-cover">
            <div className="metadata-instance-confim-container" role="alert">
                <p className="metadata-instance-confirm-text">{confirmationMessage}</p>
                <div className="metadata-instance-confirm-buttons">
                    <Button
                        ref={cancelButtonRef}
                        data-resin-target="metadata-confirmcancel"
                        onClick={onCancel}
                        type="button"
                    >
                        <FormattedMessage {...messages.metadataCancel} />
                    </Button>
                    <PrimaryButton data-resin-target="metadata-confirmremove" onClick={onConfirm} type="button">
                        <FormattedMessage {...messages.customRemove} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default MetadataInstanceConfirmDialog;
