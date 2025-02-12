import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import PlainButton from '../../components/plain-button/PlainButton';
import PrimaryButton from '../../components/primary-button/PrimaryButton';

import messages from './messages';
import './Footer.scss';

interface Props {
    onCancel: () => void;
    onRemove: () => void;
    showSave: boolean;
}

const Footer: React.FC<Props> = ({ onCancel, onRemove, showSave }) => (
    <div className="metadata-instance-editor-footer">
        <div className="metadata-instance-editor-footer-delete">
            <PlainButton data-resin-target="metadata-instanceremove" onClick={onRemove} type={ButtonType.BUTTON}>
                <FormattedMessage {...messages.metadataRemoveTemplate} />
            </PlainButton>
        </div>
        <div className="metadata-instance-editor-footer-save-cancel">
            <ButtonAdapter data-resin-target="metadata-instancecancel" onClick={onCancel} type={ButtonType.BUTTON}>
                <FormattedMessage {...messages.metadataCancel} />
            </ButtonAdapter>
            {showSave && (
                <PrimaryButton data-resin-target="metadata-instancesave" type={ButtonType.BUTTON}>
                    <FormattedMessage {...messages.metadataSave} />
                </PrimaryButton>
            )}
        </div>
    </div>
);

export default Footer;
