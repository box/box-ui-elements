/**
 * @flow
 * @file Footer component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import { Button, PrimaryButton } from '../Button';
import './Footer.scss';

type Props = {
    isLoading: boolean,
    hasFiles: boolean,
    message?: string,
    onCancel: Function,
    onClose?: Function,
    onUpload: Function
};

const Footer = ({ isLoading, hasFiles, message, onCancel, onClose, onUpload }: Props) =>
    <div className='bcu-footer'>
        <div className='bcu-footer-left'>
            {onClose
                ? <Button isDisabled={hasFiles} onClick={onClose}>
                    <FormattedMessage {...messages.close} />
                </Button>
                : null}
        </div>
        <div className='bcu-footer-message'>
            {message}
        </div>
        <div className='bcu-footer-right'>
            <Button isDisabled={!hasFiles} onClick={onCancel}>
                <FormattedMessage {...messages.cancelUploads} />
            </Button>
            <PrimaryButton isDisabled={!hasFiles} isLoading={isLoading} onClick={onUpload}>
                <FormattedMessage {...messages.upload} />
            </PrimaryButton>
        </div>
    </div>;

export default Footer;
