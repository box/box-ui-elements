/**
 * @flow
 * @file Editable transcript row component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import messages from '../messages';
import './PreviewLoading.scss';

type Props = {
    isError: boolean
};

const PreviewLoading = ({ isError }: Props) => (
    <div className='bcp-loading-wrapper'>
        {!isError ? (
            <LoadingIndicator size='large' />
        ) : (
            <div className='bcp-loading'>
                <IconFileDefault height={160} width={160} />
                <div className='bcp-loading-text'>
                    <FormattedMessage {...messages.previewError} />
                </div>
            </div>
        )}
    </div>
);

export default PreviewLoading;
