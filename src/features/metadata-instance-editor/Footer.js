// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/button/Button';
import PlainButton from 'components/plain-button/PlainButton';
import PrimaryButton from 'components/primary-button/PrimaryButton';

import messages from './messages';
import './Footer.scss';

type Props = {
    onSave?: () => void,
    onCancel: () => void,
    onRemove: () => void,
};

const Footer = ({ onCancel, onRemove, onSave }: Props) => (
    <div className="metadata-instance-editor-footer">
        <div className="metadata-instance-editor-footer-delete">
            <PlainButton data-resin-target="metadata-instanceremove" type="button" onClick={onRemove}>
                <FormattedMessage {...messages.metadataRemoveTemplate} />
            </PlainButton>
        </div>
        <div className="metadata-instance-editor-footer-save-cancel">
            <Button data-resin-target="metadata-instancecancel" type="button" onClick={onCancel}>
                <FormattedMessage {...messages.metadataCancel} />
            </Button>
            {onSave && (
                <PrimaryButton data-resin-target="metadata-instancesave" type="button" onClick={onSave}>
                    <FormattedMessage {...messages.metadataSave} />
                </PrimaryButton>
            )}
        </div>
    </div>
);

export default Footer;
