/**
 * @flow
 * @file Footer component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Button from '../../components/button/Button';
import messages from '../common/messages';
import { ERROR_CODE_UPLOAD_FILE_LIMIT } from '../../constants';
import './Footer.scss';

type Props = {
    errorCode?: string,
    fileLimit: number,
    hasFiles: boolean,
    isDone: boolean,
    isLoading: boolean,
    onCancel: Function,
    onClose?: Function,
    onUpload: Function,
};

const Footer = ({ isLoading, hasFiles, errorCode, onCancel, onClose, onUpload, fileLimit, isDone }: Props) => {
    let message;
    switch (errorCode) {
        case ERROR_CODE_UPLOAD_FILE_LIMIT:
            message = <FormattedMessage {...messages.uploadErrorTooManyFiles} values={{ fileLimit }} />;
            break;
        default:
        // ignore
    }

    return (
        <div className="bcu-footer">
            <div className="bcu-footer-left">
                {onClose ? (
                    <Button isDisabled={hasFiles} onClick={onClose} type="button">
                        <FormattedMessage {...messages.close} />
                    </Button>
                ) : null}
            </div>
            {message && <div className="bcu-footer-message">{message}</div>}
            <div className="bcu-footer-right">
                <Button isDisabled={!hasFiles || isDone} onClick={onCancel} type="button">
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <PrimaryButton isDisabled={!hasFiles} isLoading={isLoading} onClick={onUpload} type="button">
                    <FormattedMessage {...messages.upload} />
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Footer;
