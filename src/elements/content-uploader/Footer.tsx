import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import { ERROR_CODE_UPLOAD_FILE_LIMIT } from '../../constants';

import messages from '../common/messages';

import './Footer.scss';

export interface FooterProps {
    errorCode?: string;
    fileLimit: number;
    hasFiles: boolean;
    isDone: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onClose?: () => void;
    onUpload: () => void;
}

const Footer = ({ isLoading, hasFiles, errorCode, onCancel, onClose, onUpload, fileLimit, isDone }: FooterProps) => {
    const { formatMessage } = useIntl();
    const isCloseButtonDisabled = hasFiles;
    const isCancelButtonDisabled = !hasFiles || isDone;
    const isUploadButtonDisabled = !hasFiles;

    let message;

    if (errorCode === ERROR_CODE_UPLOAD_FILE_LIMIT) {
        message = <FormattedMessage {...messages.uploadErrorTooManyFiles} values={{ fileLimit }} />;
    }

    return (
        <div className="bcu-footer">
            <div className="bcu-footer-left">
                {onClose ? (
                    <Button disabled={isCloseButtonDisabled} onClick={onClose} size="large" variant="secondary">
                        {formatMessage(messages.close)}
                    </Button>
                ) : null}
            </div>
            {message && <div className="bcu-footer-message">{message}</div>}
            <div className="bcu-footer-right">
                <Button disabled={isCancelButtonDisabled} onClick={onCancel} size="large" variant="secondary">
                    {formatMessage(messages.cancel)}
                </Button>
                <Button
                    disabled={isUploadButtonDisabled}
                    loading={isLoading}
                    loadingAriaLabel={formatMessage(messages.loading)}
                    onClick={onUpload}
                    size="large"
                    variant="primary"
                >
                    {formatMessage(messages.upload)}
                </Button>
            </div>
        </div>
    );
};

export default Footer;
