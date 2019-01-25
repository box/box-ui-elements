// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/button/Button';
import PrimaryButton from 'components/primary-button/PrimaryButton';

import messages from './messages';

import './MetadataInstanceConfirmDialog.scss';

type Props = {
    onCancel: Function,
    onConfirm: Function,
    confirmationMessage: string | React.Node,
};

const MetadataInstanceConfirmDialog = ({ onCancel, onConfirm, confirmationMessage }: Props) => (
    <div className="metadata-instance-confirm-cover">
        <div className="metadata-instance-confim-container">
            <p className="metadata-instance-confirm-text">{confirmationMessage}</p>
            <div className="metadata-instance-confirm-buttons">
                <Button data-resin-target="metadata-confirmcancel" type="button" onClick={onCancel}>
                    <FormattedMessage {...messages.metadataCancel} />
                </Button>
                <PrimaryButton data-resin-target="metadata-confirmremove" type="button" onClick={onConfirm}>
                    <FormattedMessage {...messages.customRemove} />
                </PrimaryButton>
            </div>
        </div>
    </div>
);

export default MetadataInstanceConfirmDialog;
