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
    const confirmationMessageElement = React.useRef(null);

    React.useEffect(() => {
        if (confirmationMessageElement.current) {
            confirmationMessageElement.current.focus();
        }
    });

    return (
        <div className="metadata-instance-confirm-cover">
            <div className="metadata-instance-confim-container">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <div tabIndex="0" ref={confirmationMessageElement}>
                    <p className="metadata-instance-confirm-text">{confirmationMessage}</p>
                </div>
                <div className="metadata-instance-confirm-buttons">
                    <Button data-resin-target="metadata-confirmcancel" onClick={onCancel} type="button">
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
