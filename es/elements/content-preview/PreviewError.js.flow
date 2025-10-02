/**
 * @flow
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconFileDefault from '../../icon/content/FileDefault32';
import SecurityBlockedState from '../../icons/states/SecurityBlockedState';
import messages from '../common/messages';
import { ERROR_CODE_FETCH_FILE_DUE_TO_POLICY } from '../../constants';
import './PreviewError.scss';

type Props = {
    errorCode?: string,
};

export default function PreviewError({ errorCode }: Props) {
    const isBlockedByPolicy = errorCode === ERROR_CODE_FETCH_FILE_DUE_TO_POLICY;
    const message = isBlockedByPolicy ? messages.previewErrorBlockedByPolicy : messages.previewError;
    const icon = isBlockedByPolicy ? <SecurityBlockedState /> : <IconFileDefault height={160} width={160} />;
    return (
        <div className="bcpr-PreviewError">
            {icon}
            <div className="bcpr-PreviewError-message">
                <FormattedMessage {...message} />
            </div>
        </div>
    );
}
