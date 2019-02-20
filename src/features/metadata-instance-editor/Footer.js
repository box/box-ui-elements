// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../components/button/Button';
import PlainButton from '../../components/plain-button/PlainButton';
import PrimaryButton from '../../components/primary-button/PrimaryButton';

import messages from './messages';
import './Footer.scss';

type Props = {
    onCancel: () => void,
    onRemove: () => void,
    onSave?: () => void,
};

const Footer = ({ onCancel, onRemove, onSave }: Props) => (
    <div className="metadata-instance-editor-footer">
        <div className="metadata-instance-editor-footer-delete">
            <PlainButton data-resin-target="metadata-instanceremove" onClick={onRemove} type="button">
                <FormattedMessage {...messages.metadataRemoveTemplate} />
            </PlainButton>
        </div>
        <div className="metadata-instance-editor-footer-save-cancel">
            <Button data-resin-target="metadata-instancecancel" onClick={onCancel} type="button">
                <FormattedMessage {...messages.metadataCancel} />
            </Button>
            {onSave && (
                <PrimaryButton data-resin-target="metadata-instancesave" onClick={onSave} type="button">
                    <FormattedMessage {...messages.metadataSave} />
                </PrimaryButton>
            )}
        </div>
    </div>
);

export default Footer;
