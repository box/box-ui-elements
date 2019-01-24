/**
 * @flow
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import makeLoadable from 'box-react-ui/lib/components/loading-indicator/makeLoadable';
import messages from 'elements/common/messages';
import './PreviewLoading.scss';

const PreviewLoading = () => (
    <div className="bcpr-loading">
        <IconFileDefault height={160} width={160} />
        <div className="bcpr-loading-text">
            <FormattedMessage {...messages.previewError} />
        </div>
    </div>
);

export { PreviewLoading as PreviewLoadingComponent };
export default makeLoadable(PreviewLoading);
