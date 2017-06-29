/**
 * @flow
 * @file Footer component
 */

import React from 'react';
import { Button, PrimaryButton } from '../Button';
import './Footer.scss';

type Props = {
    isLoading: boolean,
    hasFiles: boolean,
    onCancel: Function,
    onClose?: Function,
    onUpload: Function,
    getLocalizedMessage: Function
};

const Footer = ({ isLoading, hasFiles, onCancel, onClose, onUpload, getLocalizedMessage }: Props) =>
    <div className='bcu-footer'>
        <div className='bcu-footer-left'>
            {onClose
                ? <Button isDisabled={hasFiles} onClick={onClose}>
                    {getLocalizedMessage('buik.footer.button.close')}
                </Button>
                : null}
        </div>
        <div className='bcu-footer-right'>
            <Button isDisabled={!hasFiles} onClick={onCancel}>
                {getLocalizedMessage('buik.footer.button.cancel.uploads')}
            </Button>
            <PrimaryButton isDisabled={!hasFiles} isLoading={isLoading} onClick={onUpload}>
                {getLocalizedMessage('buik.footer.button.upload')}
            </PrimaryButton>
        </div>
    </div>;

export default Footer;
