/**
 * @flow
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconFileDefault from '../../icon/content/FileDefault32';
import SecurityBlockedState from '../../icons/states/SecurityBlockedState';
import makeLoadable from '../../components/loading-indicator/makeLoadable';
import messages from '../common/messages';
import { ERROR_CODE_FETCH_FILE_DUE_TO_POLICY } from '../../constants';
import './PreviewLoading.scss';

type Props = {
    errorCode?: string,
};

const PreviewLoading = ({ errorCode }: Props) => {
    const isBlockedByPolicy = errorCode === ERROR_CODE_FETCH_FILE_DUE_TO_POLICY;
    const message = isBlockedByPolicy ? messages.previewErrorBlockedByPolicy : messages.previewError;
    const icon = isBlockedByPolicy ? <SecurityBlockedState /> : <IconFileDefault height={160} width={160} />;
    return (
        <div className="bcpr-PreviewLoading">
            {icon}
            <div className="bcpr-PreviewLoading-message">
                <FormattedMessage {...message} />
            </div>
        </div>
    );
};

export { PreviewLoading as PreviewLoadingComponent };
export default makeLoadable(PreviewLoading);
