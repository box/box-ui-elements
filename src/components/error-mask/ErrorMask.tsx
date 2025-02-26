import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import IconSadCloud from '../../icons/general/IconSadCloud';

import './ErrorMask.scss';

const messages = defineMessages({
    errorMaskIconSadCloudText: {
        defaultMessage: 'Sad Box Cloud',
        description: 'Icon showing a sad Box cloud',
        id: 'boxui.errorMask.iconSadCloudText',
    },
});

export interface ErrorMaskProps {
    /** Text or element displayed in the header of the error mask */
    errorHeader: React.ReactNode;
    /** Text or element displayed in the subheader of the error mask */
    errorSubHeader?: React.ReactNode;
}

const ErrorMask = ({ errorHeader, errorSubHeader }: ErrorMaskProps) => (
    <div className="error-mask">
        <IconSadCloud
            className="error-mask-sad-cloud"
            height={50}
            title={<FormattedMessage {...messages.errorMaskIconSadCloudText} />}
        />
        <h4>{errorHeader}</h4>
        <h5>{errorSubHeader}</h5>
    </div>
);

export default ErrorMask;
