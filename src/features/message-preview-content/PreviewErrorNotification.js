// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Picture16 from '../../icon/fill/Picture16';

import messages from './messages';
import './styles/PreviewErrorNotification.scss';

function PreviewErrorNotification() {
    return (
        <div className="PreviewErrorNotification">
            <Picture16 className="PreviewErrorNotification-image" />
            <div className="PreviewErrorNotification-message">
                <FormattedMessage {...messages.messagePreviewError} />
            </div>
        </div>
    );
}

export default PreviewErrorNotification;
