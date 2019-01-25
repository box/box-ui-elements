// @flow
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

type Props = {
    errorHeader: React.Node,
    errorSubHeader?: React.Node,
};

const ErrorMask = ({ errorHeader, errorSubHeader }: Props) => (
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
